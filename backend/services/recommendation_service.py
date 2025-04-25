import json
import time
import os
import re
from typing import Optional
from fastapi import HTTPException
from pydantic import ValidationError

from models.requests import RecommendationRequest
from models.responses import SolarRecommendation
from services.llm_service import llm_prompt_response

# Helper function to parse currency strings (moved from server.py)
def parse_currency(value_str: str) -> Optional[float]:
    """Removes currency symbols and commas, converts to float. Returns None if parsing fails."""
    if not isinstance(value_str, str):
        return None
    # Remove currency symbols (₹, $, etc.) and commas
    cleaned_str = re.sub(r'[^\d.]', '', value_str)
    if not cleaned_str:
        return None
    try:
        return float(cleaned_str)
    except ValueError:
        return None

def generate_recommendation(request: RecommendationRequest) -> SolarRecommendation:
    start_time = time.time()
    max_retries = 3
    recommendation: Optional[SolarRecommendation] = None
    last_error = None
    llm_output = ""

    try:
        # Use relative path from the service file location
        base_path = os.path.dirname(__file__)
        subsidy_context_path = os.path.join(base_path, '..', 'context', 'subsidy_info.md')
        general_context_path = os.path.join(base_path, '..', 'context', 'general_solar_context.md')

        # 1. Read static context from markdown files
        try:
            with open(subsidy_context_path, "r") as f_subsidy:
                subsidy_context = f_subsidy.read()
        except FileNotFoundError:
            subsidy_context = "Subsidy information is currently unavailable."
            print(f"Warning: {subsidy_context_path} not found.")

        try:
            with open(general_context_path, "r") as f_general:
                general_context = f_general.read()
        except FileNotFoundError:
            general_context = "General solar information is currently unavailable."
            print(f"Warning: {general_context_path} not found.")

        combined_context = f"""
## Subsidy Information
{subsidy_context}

## General Solar Information
{general_context}
        """

        # 2. Construct the base prompt for the LLM
        json_output_format = json.dumps(SolarRecommendation.model_json_schema(), indent=2)

        base_system_prompt = f"""
You are an expert Solar Energy Advisor for India. Your task is to generate a personalized solar panel system recommendation based on the user's specific details and the provided context.

**Context:**
{combined_context}

**User Details:**
- Pincode: {request.pin}
- District/State: {request.district_state}
- Available Roof Size: {request.roof_size} sq ft
- Average Monthly Electricity Bill: Rs. {request.monthly_bill}
- Approximate Budget: Rs. {request.budget}

**Instructions:**
1. Analyze the user details and the context (especially subsidy information relevant to India).
2. Determine a suitable solar panel system configuration (capacity, panel type, number of panels).
3. Suggest an appropriate battery solution if applicable (type, capacity, backup duration).
4. Estimate costs for panels and battery. Ensure these are numerical estimates prefixed with '₹' and using commas (e.g., ₹3,50,000).
5. Provide installation details (time, warranty, maintenance).
6. Calculate the estimated subsidy amount based on the recommended system capacity and the rules in the context. Ensure this is a numerical estimate prefixed with '₹' (e.g., ₹94,500).
7. **Provide a clear breakdown of how the subsidy amount was calculated in the 'subsidy_breakdown' field.** Explain the calculation based on the system capacity (e.g., "Subsidy for first 3kW: 3 * ₹18,000 = ₹54,000. Subsidy for next 2kW: 2 * ₹9,000 = ₹18,000. Total: ₹72,000").
8. Ensure all monetary values (costs, subsidy) are in Indian Rupees (₹) and use appropriate formatting (e.g., ₹1,00,000).
9. Keep the total cost (after potential subsidy) within or close to the user's budget. If the budget is insufficient for the *ideal* system, recommend the best possible system within the budget, clearly stating any compromises made. If no reasonable system fits the budget even with subsidy, state this clearly in the cost/subsidy fields (e.g., "Budget too low for recommended system").
10. **Strictly format your entire response as a single JSON object matching the following structure. Do not include any text, explanations, or markdown formatting before or after the JSON object.**
```json
{json_output_format}
```
Ensure the JSON is valid.
"""

        for attempt in range(max_retries):
            print(f"Recommendation attempt {attempt + 1}/{max_retries}")
            try:
                retry_prompt_addition = ""
                if attempt > 0:
                    retry_prompt_addition = "\n\n**Reminder:** Please ensure your output is ONLY the JSON object requested, with no extra text or formatting."

                system_prompt = base_system_prompt + retry_prompt_addition

                # 3. Generate the AI response
                llm_output = llm_prompt_response(system_prompt)
                print(f"LLM Raw Output (Attempt {attempt + 1}):\n{llm_output}")

                # 4. Parse the LLM response string
                cleaned_llm_output = llm_output.strip()
                if cleaned_llm_output.startswith("```json"):
                    cleaned_llm_output = cleaned_llm_output[7:]
                if cleaned_llm_output.endswith("```"):
                    cleaned_llm_output = cleaned_llm_output[:-3]
                cleaned_llm_output = cleaned_llm_output.strip()

                recommendation = SolarRecommendation.model_validate_json(cleaned_llm_output)
                print(f"Successfully Parsed Recommendation: {recommendation}")
                break

            except (json.JSONDecodeError, ValidationError) as parse_error:
                last_error = parse_error
                print(f"Error parsing LLM response on attempt {attempt + 1}: {parse_error}")
                print(f"Problematic LLM Output was: {llm_output}")
                if attempt == max_retries - 1:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to parse recommendation from AI after {max_retries} attempts. Last error: {parse_error}. Last raw output: {llm_output}"
                    )
                continue

        if recommendation is None:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to obtain valid recommendation after {max_retries} attempts. Last error: {last_error}. Last raw output: {llm_output}"
            )

        # 5. Budget Check (Optional: Can be done in the router or frontend)
        # Consider moving this check to the router or frontend if you want the service
        # to purely focus on generating the recommendation object.
        try:
            panel_cost_val = parse_currency(recommendation.solar_panel_setup.estimated_cost)
            battery_cost_val = parse_currency(recommendation.battery_solution.estimated_cost)
            subsidy_amount_val = parse_currency(recommendation.installation_details.subsidy_available)

            if panel_cost_val is not None and battery_cost_val is not None and subsidy_amount_val is not None:
                total_estimated_cost = panel_cost_val + battery_cost_val
                available_funds = request.budget + subsidy_amount_val

                print(f"Budget Check: Total Cost={total_estimated_cost}, Subsidy={subsidy_amount_val}, Budget={request.budget}, Available Funds={available_funds}")

                if available_funds < total_estimated_cost:
                    shortfall = total_estimated_cost - available_funds
                    # Instead of raising HTTPException here, maybe add a note to the recommendation?
                    # Or let the router handle this based on the returned recommendation.
                    print(f"Warning: Budget Insufficient by approx ₹{shortfall:,.2f}")
                    # Example: Add a note (this requires modifying the SolarRecommendation model)
                    # recommendation.budget_note = f"Warning: Budget insufficient by approx ₹{shortfall:,.2f}"

            else:
                 print("Warning: Could not parse all cost/subsidy values for budget check.")

        except Exception as budget_check_error:
            print(f"Warning: Error during budget check: {budget_check_error}")
            # Don't raise an exception here, just log it. The recommendation itself is valid.

        # execution_time = time.time() - start_time # Can be calculated and returned if needed

        return recommendation

    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=500, detail=f"Context file not found: {fnf_error}")
    except HTTPException as http_exc:
        raise http_exc # Re-raise HTTP exceptions from parsing retries
    except Exception as e:
        # Log the error internally
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")

