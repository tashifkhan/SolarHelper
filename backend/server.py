import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, ValidationError
from typing import Optional, List
import time
import os
import re  # Import re for parsing

from scrapy import (
    return_awaited_md,
    prompt_generator,
    llm_prompt_response
)

app = FastAPI(
    title="Solar Helper Backend",
    description="hehe",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ScraperRequest(BaseModel):
    url: str
    prompt: str
    timeout: Optional[int] = 300

class ChatHistoryItem(BaseModel):
    prompt: Optional[str] = None
    answer: Optional[str] = None

class SubsidyQuery(BaseModel):
    prompt: str  # User's current question/message
    timeout: Optional[int] = 300
    response: List[ChatHistoryItem] = []

class ScraperResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None
    execution_time: float

class ChatResponse(BaseModel):
    answer: str
    prev_responses: List[ChatHistoryItem]
    execution_time: float

class SolarPanelSetup(BaseModel):
    recommended_capacity: str = "5kW"
    panel_type: str = "Monocrystalline"
    number_of_panels: int = 15
    estimated_cost: str = "₹3,50,000"

class BatterySolution(BaseModel):
    battery_type: str = "Lithium-ion"
    capacity: str = "10kWh"
    backup_duration: str = "8-10 hours"
    estimated_cost: str = "₹2,50,000"

class InstallationDetails(BaseModel):
    installation_time: str = "3-4 days"
    warranty: str = "25 years"
    annual_maintenance: str = "₹5,000"
    subsidy_available: str = "₹94,500"
    subsidy_breakdown: Optional[str] = "Detailed breakdown of subsidy calculation."  # Added field

class SolarRecommendation(BaseModel):
    solar_panel_setup: SolarPanelSetup
    battery_solution: BatterySolution
    installation_details: InstallationDetails

class RecommendationRequest(BaseModel):
    pin: str
    district_state: str
    roof_size: float  # e.g., "500"
    monthly_bill: float  # e.g., "₹2500"
    budget: float  # e.g., "₹5,00,000"
    timeout: Optional[int] = 300

@app.post("/scrape", response_model=ScraperResponse)
async def scrape_website(request: ScraperRequest):
    """
    Scrape a website and extract information based on the provided prompt.

    - **url**: URL of the website to scrape
    - **prompt**: Description of what information to extract
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    """
    start_time = time.time()

    try:
        dom_content = return_awaited_md(request.url)

        full_prompt = prompt_generator(dom_content, request.prompt)
        response = llm_prompt_response(full_prompt)

        execution_time = time.time() - start_time

        return ScraperResponse(
            success=True,
            data=response,
            execution_time=execution_time
        )

    except Exception as e:
        execution_time = time.time() - start_time

        return ScraperResponse(
            success=False,
            error=str(e),
            execution_time=execution_time
        )


@app.post("/subsidy-enquiry", response_model=ChatResponse)
async def subsidy_enquiry(request: SubsidyQuery):
    """
    Process a subsidy enquiry chat request.

    This endpoint handles chat interactions regarding solar subsidies,
    maintaining conversation history and using static subsidy information as context.

    - **prompt**: User's current question/message about solar subsidies
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    - **response**: List of previous conversation exchanges [{"prompt": "user_msg", "answer": "ai_msg"}, ...]
    """
    start_time = time.time()
    try:
        # 1. Read static subsidy context
        with open(os.path.join(os.path.dirname(__file__), "subsidy_info.md"), "r") as ft:
            subsidy_context = ft.read()
            ft.close()

        # 2. Build conversation history string
        conversation_history = "Previous conversation:\n"
        if request.response:
            for exchange in request.response:
                if exchange.prompt:
                    conversation_history += f"User: {exchange.prompt}\n"
                if exchange.answer:
                    conversation_history += f"Agent: {exchange.answer}\n"

        # 3. Construct the full prompt for the LLM
        system_prompt = f"""
You are a helpful assistant specializing in solar panel subsidies based on the following information:
{subsidy_context}

Answer the user's questions clearly and concisely, using the provided information and the conversation history.
{conversation_history}
User: {request.prompt}
Agent:"""

        # 4. Generate the AI response (using the existing llm_prompt_response)
        ai_answer = llm_prompt_response(system_prompt)
        execution_time = time.time() - start_time

        # 5. Update conversation history
        updated_history = request.response + [ChatHistoryItem(prompt=request.prompt, answer=ai_answer)]

        return ChatResponse(answer=ai_answer, prev_responses=updated_history, execution_time=execution_time)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/general-solar-enquiry", response_model=ChatResponse)
async def general_solar_enquiry(request: SubsidyQuery):
    """
    Process a general solar energy enquiry chat request.

    This endpoint handles chat interactions regarding general solar energy topics,
    using information from both subsidy and general context files, and maintaining
    conversation history.

    - **prompt**: User's current question/message about solar energy
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    - **response**: List of previous conversation exchanges [{"prompt": "user_msg", "answer": "ai_msg"}, ...]
    """
    start_time = time.time()
    try:
        base_path = os.path.dirname(__file__)
        # 1. Read static context from both files
        with open(os.path.join(base_path, "subsidy_info.md"), "r") as f_subsidy:
            subsidy_context = f_subsidy.read()

        with open(os.path.join(base_path, "general_solar_context.md"), "r") as f_general:
            general_context = f_general.read()

        combined_context = f"""
## Subsidy Information
{subsidy_context}

## General Solar Information
{general_context}
        """

        # 2. Build conversation history string
        conversation_history = "Previous conversation:\n"
        if request.response:
            for exchange in request.response:
                if exchange.prompt:
                    conversation_history += f"User: {exchange.prompt}\n"
                if exchange.answer:
                    conversation_history += f"Agent: {exchange.answer}\n"

        # 3. Construct the full prompt for the LLM
        system_prompt = f"""
You are a helpful assistant specializing in solar energy in India, covering both general topics and specific subsidy information based on the following context:
{combined_context}

Answer the user's questions clearly and concisely, using the provided information and the conversation history.
{conversation_history}
User: {request.prompt}
Agent:"""

        # 4. Generate the AI response (using the existing llm_prompt_response)
        ai_answer = llm_prompt_response(system_prompt)
        execution_time = time.time() - start_time

        # 5. Update conversation history
        updated_history = request.response + [ChatHistoryItem(prompt=request.prompt, answer=ai_answer)]

        return ChatResponse(answer=ai_answer, prev_responses=updated_history, execution_time=execution_time)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper function to parse currency strings
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

@app.post("/recommendation", response_model=SolarRecommendation)
async def get_solar_recommendation(request: RecommendationRequest):
    """
    Generate a personalized solar recommendation based on user inputs.

    This endpoint uses user-provided details and contextual information
    to ask an LLM for a tailored solar setup recommendation. It attempts
    to parse the JSON response and retries if parsing fails. It also checks
    if the user's budget plus estimated subsidy covers the estimated cost.

    - **pin**: User's Pincode
    - **district_state**: User's District and State (e.g., "Pune, Maharashtra")
    - **roof_size**: Available roof area (e.g., "500 sq ft")
    - **monthly_bill**: Average monthly electricity bill (e.g., "₹2500")
    - **budget**: User's approximate budget (e.g., "₹5,00,000")
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    """
    start_time = time.time()
    max_retries = 3
    recommendation: Optional[SolarRecommendation] = None
    last_error = None
    llm_output = ""

    try:
        base_path = os.path.dirname(__file__)
        # 1. Read static context from markdown files (moved outside loop)
        try:
            with open(os.path.join(base_path, "subsidy_info.md"), "r") as f_subsidy:
                subsidy_context = f_subsidy.read()
        except FileNotFoundError:
            subsidy_context = "Subsidy information is currently unavailable."
            print("Warning: subsidy_info.md not found.")

        try:
            with open(os.path.join(base_path, "general_solar_context.md"), "r") as f_general:
                general_context = f_general.read()
        except FileNotFoundError:
            general_context = "General solar information is currently unavailable."
            print("Warning: general_solar_context.md not found.")

        combined_context = f"""
## Subsidy Information
{subsidy_context}

## General Solar Information
{general_context}
        """

        # 2. Construct the base prompt for the LLM (moved outside loop)
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
                # Add a stronger reminder on subsequent attempts
                retry_prompt_addition = ""
                if attempt > 0:
                    retry_prompt_addition = "\n\n**Reminder:** Please ensure your output is ONLY the JSON object requested, with no extra text or formatting."

                system_prompt = base_system_prompt + retry_prompt_addition

                # 3. Generate the AI response
                llm_output = llm_prompt_response(system_prompt)
                print(f"LLM Raw Output (Attempt {attempt + 1}):\n{llm_output}")

                # 4. Parse the LLM response string into the Pydantic model
                # Clean potential markdown code fences
                cleaned_llm_output = llm_output.strip()
                if cleaned_llm_output.startswith("```json"):
                    cleaned_llm_output = cleaned_llm_output[7:]
                if cleaned_llm_output.endswith("```"):
                    cleaned_llm_output = cleaned_llm_output[:-3]
                cleaned_llm_output = cleaned_llm_output.strip() # Ensure no leading/trailing whitespace remains

                # Attempt validation
                recommendation = SolarRecommendation.model_validate_json(cleaned_llm_output)
                print(f"Successfully Parsed Recommendation: {recommendation}")
                break  # Exit loop on success

            except (json.JSONDecodeError, ValidationError) as parse_error:
                last_error = parse_error
                print(f"Error parsing LLM response on attempt {attempt + 1}: {parse_error}")
                print(f"Problematic LLM Output was: {llm_output}")
                if attempt == max_retries - 1: # If last attempt failed
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to parse the recommendation from the AI model after {max_retries} attempts. Last error: {parse_error}. Last raw output: {llm_output}"
                    )
                # Wait a moment before retrying (optional)
                # time.sleep(1)
                continue # Go to next attempt

        # Ensure recommendation is not None after the loop (should be guaranteed by break or raise)
        if recommendation is None:
             # This case should ideally not be reached due to the logic above, but acts as a safeguard
            raise HTTPException(
                status_code=500,
                detail=f"Failed to obtain a valid recommendation after {max_retries} attempts. Last error: {last_error}. Last raw output: {llm_output}"
            )

        execution_time = time.time() - start_time # Calculate time after successful loop or final failure

        # 5. Budget Check (remains the same)
        try:
            panel_cost_val = parse_currency(recommendation.solar_panel_setup.estimated_cost)
            battery_cost_val = parse_currency(recommendation.battery_solution.estimated_cost)
            subsidy_amount_val = parse_currency(recommendation.installation_details.subsidy_available)

            # ... (rest of budget check logic remains unchanged) ...
            if panel_cost_val is not None and battery_cost_val is not None and subsidy_amount_val is not None:
                total_estimated_cost = panel_cost_val + battery_cost_val
                available_funds = request.budget + subsidy_amount_val

                print(f"Budget Check: Total Cost={total_estimated_cost}, Subsidy={subsidy_amount_val}, Budget={request.budget}, Available Funds={available_funds}")

                if available_funds < total_estimated_cost:
                    shortfall = total_estimated_cost - available_funds
                    error_message = (
                        f"Budget Insufficient: Your budget (₹{request.budget:,.2f}) plus the estimated subsidy "
                        f"(₹{subsidy_amount_val:,.2f}) totals ₹{available_funds:,.2f}, which is not enough to cover the "
                        f"estimated total system cost of ₹{total_estimated_cost:,.2f} "
                        f"(Panels: {recommendation.solar_panel_setup.estimated_cost}, "
                        f"Battery: {recommendation.battery_solution.estimated_cost}). "
                        f"You are short by approximately ₹{shortfall:,.2f}. "
                        f"Please consider increasing your budget or exploring financing options."
                    )
                    print(f"Budget Check Failed: {error_message}")
                    raise HTTPException(status_code=400, detail=error_message)  # Use 400 Bad Request
            else:
                # Log if parsing failed for any value, but proceed to return recommendation
                # as the LLM might have provided non-numeric estimates as instructed.
                parsing_issues = []
                if panel_cost_val is None:
                    parsing_issues.append("panel cost")
                if battery_cost_val is None:
                    parsing_issues.append("battery cost")
                if subsidy_amount_val is None:
                    parsing_issues.append("subsidy amount")
                if parsing_issues:
                    print(f"Warning: Could not parse numerical values for {', '.join(parsing_issues)}. Skipping budget check.")

        except Exception as budget_check_error:
            # Catch potential errors during the budget check logic itself, besides the HTTPException
            print(f"Error during budget check: {budget_check_error}")
            # Re-raise if it was the intended HTTPException
            if isinstance(budget_check_error, HTTPException):
                raise budget_check_error
            # Otherwise, raise a generic server error for unexpected issues
            raise HTTPException(status_code=500, detail=f"An internal error occurred during budget verification: {str(budget_check_error)}")

        # 6. Return the recommendation if budget is sufficient or check was skipped
        return recommendation

    except FileNotFoundError as fnf_error:
        print(f"Context file not found: {fnf_error}")
        raise HTTPException(status_code=500, detail=f"Server configuration error: Missing context file {fnf_error.filename}")
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions directly (like the budget check or parsing failure ones)
        raise http_exc
    except Exception as e:
        print(f"An unexpected error occurred in /recommendation endpoint: {e}")
        # Include last LLM output if available and relevant
        detail_msg = f"An unexpected error occurred: {str(e)}"
        if llm_output:
             detail_msg += f". Last LLM output attempt: {llm_output[:200]}..." # Truncate potentially long output
        raise HTTPException(status_code=500, detail=detail_msg)


@app.get("/")
async def root():
    """Redirect root to documentation page"""
    return RedirectResponse(url="/docs")

@app.get("/check")
async def check():
    """Simple check endpoint for the fastapi"""
    return {"status": "working", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

