import json
import time
import os
import re
from typing import Optional
from fastapi import HTTPException
from pydantic import ValidationError
# RAG Imports
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from models.requests import RecommendationRequest
from models.responses import SolarRecommendation
from services.llm_service import llm_prompt_response

# --- RAG Setup ---
# Use relative paths from the service file location
CONTEXT_DIR = os.path.join(os.path.dirname(__file__), '..', 'context')
VECTORSTORE_PATH = os.path.join(os.path.dirname(__file__), '..', 'vectorstore_faiss_recommendation') # Use a separate store if needed, or reuse the chat one

def setup_rag_retriever(force_recreate=False):
    """Loads documents, creates embeddings, stores them in FAISS, and returns a retriever."""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    # Check if the context directory exists
    if not os.path.isdir(CONTEXT_DIR):
        print(f"Error: Context directory not found at {CONTEXT_DIR}")
        raise FileNotFoundError(f"Context directory not found: {CONTEXT_DIR}")

    if os.path.exists(VECTORSTORE_PATH) and not force_recreate:
        print("Loading existing recommendation vector store...")
        try:
            vectorstore = FAISS.load_local(VECTORSTORE_PATH, embeddings, allow_dangerous_deserialization=True)
        except Exception as load_error:
            print(f"Error loading existing vector store: {load_error}. Attempting to recreate.")
            return setup_rag_retriever(force_recreate=True) # Retry with recreation
    else:
        print("Creating new recommendation vector store...")
        # Ensure the context directory exists before loading
        if not os.path.isdir(CONTEXT_DIR):
             raise FileNotFoundError(f"Cannot create vector store: Context directory not found at {CONTEXT_DIR}")

        loader = DirectoryLoader(CONTEXT_DIR, glob="**/*.md", loader_cls=TextLoader, use_multithreading=True)
        try:
            documents = loader.load()
        except Exception as load_docs_error:
             print(f"Error loading documents from {CONTEXT_DIR}: {load_docs_error}")
             raise

        if not documents:
            print(f"Warning: No documents found in context directory: {CONTEXT_DIR}")
            # Optionally, handle this case differently, e.g., raise an error or return a dummy retriever
            # For now, we proceed, but the retriever will have no context.
            # Consider creating an empty FAISS store if this is acceptable.
            # return None # Or handle appropriately

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        docs = text_splitter.split_documents(documents)

        if not docs:
             print("Warning: No documents were generated after splitting.")
             # Handle this case as well, maybe return None or an empty retriever

        try:
            vectorstore = FAISS.from_documents(docs, embeddings)
            vectorstore.save_local(VECTORSTORE_PATH)
            print(f"Recommendation vector store created and saved at {VECTORSTORE_PATH}")
        except Exception as faiss_error:
            print(f"Error creating or saving FAISS vector store: {faiss_error}")
            raise

    # Return retriever with slightly more context if available
    return vectorstore.as_retriever(search_kwargs={"k": 5})

try:
    retriever = setup_rag_retriever()
except Exception as e:
    print(f"Fatal Error setting up RAG retriever for recommendations: {e}")
    retriever = None # Ensure retriever is None if setup fails

# --- End RAG Setup ---

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
    if retriever is None:
        raise HTTPException(status_code=500, detail="Recommendation service RAG retriever not initialized.")

    max_retries = 9
    recommendation: Optional[SolarRecommendation] = None
    last_error = None
    llm_output = ""

    try:
        # 1. Construct retrieval query from user request
        retrieval_query = f"""
        User Pincode: {request.pin}
        User District/State: {request.district_state}
        User Roof Size: {request.roof_size} sq ft
        User Monthly Bill: Rs. {request.monthly_bill}
        User Budget: Rs. {request.budget}
        Relevant information for solar panel recommendation including subsidies, system sizing based on bill/roof, costs, and installation details for this user.
        """

        # 2. Retrieve relevant context using RAG
        try:
            retrieved_docs = retriever.invoke(retrieval_query)
            retrieved_context = "\n\n---\n\n".join([doc.page_content for doc in retrieved_docs])
            if not retrieved_context:
                print("Warning: RAG retriever returned no context for the query.")
                retrieved_context = "No specific context could be retrieved. Relying on general knowledge."
        except Exception as retrieve_error:
            print(f"Error retrieving context: {retrieve_error}")
            raise HTTPException(status_code=500, detail=f"Error retrieving context: {str(retrieve_error)}")


        # 3. Construct the prompt for the LLM using retrieved context
        json_output_format = json.dumps(SolarRecommendation.model_json_schema(), indent=2)

        base_system_prompt = f"""
You are an expert Solar Energy Advisor for India. Your task is to generate a personalized solar panel system recommendation based on the user's specific details and the provided context.

**Retrieved Context (Use this information primarily):**
{retrieved_context}

**User Details:**
- Pincode: {request.pin}
- District/State: {request.district_state}
- Available Roof Size: {request.roof_size} sq ft
- Average Monthly Electricity Bill: Rs. {request.monthly_bill}
- Approximate Budget: Rs. {request.budget}

**Instructions:**
1. Analyze the user details and the **retrieved context** (especially subsidy information relevant to India and the user's location if available). If context is missing specific details (like location-specific subsidies not found), state that clearly but still provide the best general recommendation possible.
2. Determine a suitable solar panel system configuration (capacity, panel type, number of panels). Base capacity primarily on the monthly bill and roof size.
3. Suggest an appropriate battery solution if applicable (type, capacity, backup duration). Consider if the user's bill suggests high usage or if off-grid/hybrid is implied.
4. Estimate costs for panels and battery based on the context or general Indian market rates if context is insufficient. Ensure these are numerical estimates prefixed with '₹' and using commas (e.g., ₹3,50,000).
5. Provide installation details (time, warranty, maintenance) based on context or typical standards.
6. Calculate the estimated subsidy amount based on the recommended system capacity and the rules in the **retrieved context**. Ensure this is a numerical estimate prefixed with '₹' (e.g., ₹94,500). If context lacks specific subsidy rules, mention that the subsidy calculation is based on general national schemes.
7. **Provide a clear breakdown of how the subsidy amount was calculated in the 'subsidy_breakdown' field.** Explain the calculation based on the system capacity and the rules found in the context (e.g., "Based on national scheme: Subsidy for first 3kW: 3 * ₹18,000 = ₹54,000. Subsidy for next 2kW: 2 * ₹9,000 = ₹18,000. Total: ₹72,000"). If no specific rules were found, state this in the breakdown.
8. Ensure all monetary values (costs, subsidy) are in Indian Rupees (₹) and use appropriate formatting (e.g., ₹1,00,000).
9. Keep the total cost (after potential subsidy) within or close to the user's budget. If the budget is insufficient for the *ideal* system based on their bill/roof size, recommend the best possible system within the budget, clearly stating any compromises made (e.g., smaller capacity, no battery). If no reasonable system fits the budget even with subsidy, state this clearly in the cost/subsidy fields (e.g., "Budget too low for recommended system").
10. **Provide a clear reason for selecting the recommended panel capacity in the 'panel_choice_reason' field inside the 'solar_panel_setup' object, explaining how the capacity matches the user's needs.**
11. **Provide a clear reason for choosing the battery technology in the 'battery_choice_reason' field inside the 'battery_solution' object, explaining why that technology is suitable for this user.**
12. **Strictly format your entire response as a single JSON object matching the following structure. Do not include any text, explanations, or markdown formatting before or after the JSON object.**
```json
{json_output_format}
```
Ensure the JSON is valid.
"""

        # 4. LLM Call and Parsing Loop (Retry Logic)
        for attempt in range(max_retries):
            print(f"Recommendation attempt {attempt + 1}/{max_retries}")
            try:
                retry_prompt_addition = ""
                if attempt > 0:
                    retry_prompt_addition = "\n\n**Reminder:** Please ensure your output is ONLY the JSON object requested, with no extra text or formatting."

                system_prompt = base_system_prompt + retry_prompt_addition

                # 5. Generate the AI response (using the updated prompt)
                llm_output = llm_prompt_response(system_prompt)
                print(f"LLM Raw Output (Attempt {attempt + 1}):\n{llm_output}")

                # 6. Parse the LLM response string
                cleaned_llm_output = llm_output.strip()
                if cleaned_llm_output.startswith("```json"):
                    cleaned_llm_output = cleaned_llm_output[7:]
                if cleaned_llm_output.endswith("```"):
                    cleaned_llm_output = cleaned_llm_output[:-3]
                cleaned_llm_output = cleaned_llm_output.strip()

                recommendation = SolarRecommendation.model_validate_json(cleaned_llm_output)
                print(f"Successfully Parsed Recommendation: {recommendation}")
                break # Exit loop on success

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

        # 7. Budget Check (No changes needed here, uses parsed recommendation)
        try:
            # Ensure the SolarRecommendation model has an optional 'budget_note: Optional[str] = None' field
            # Initialize budget_note to None
            recommendation.budget_note = None

            panel_cost_val = parse_currency(recommendation.solar_panel_setup.estimated_cost)
            battery_cost_val = parse_currency(recommendation.battery_solution.estimated_cost)
            subsidy_amount_val = parse_currency(recommendation.installation_details.subsidy_available)

            # Proceed only if all values could be parsed
            if panel_cost_val is not None and battery_cost_val is not None and subsidy_amount_val is not None:
                total_estimated_cost = panel_cost_val + battery_cost_val
                # Ensure request.budget is treated as a float
                user_budget = float(request.budget) if request.budget is not None else 0.0
                available_funds = user_budget + subsidy_amount_val

                print(f"Budget Check: Total Cost=₹{total_estimated_cost:,.0f}, Subsidy=₹{subsidy_amount_val:,.0f}, Budget=₹{user_budget:,.0f}, Available Funds=₹{available_funds:,.0f}")

                # Only add a note if the cost exceeds available funds
                if available_funds < total_estimated_cost:
                    shortfall = total_estimated_cost - available_funds
                    warning_message = f"Warning: The estimated total cost (₹{total_estimated_cost:,.0f}) exceeds your budget plus the estimated subsidy (₹{available_funds:,.0f}) by approximately ₹{shortfall:,.0f}. Adjustments may be needed to fit your budget."
                    print(warning_message)
                    # Add the warning note to the recommendation object
                    recommendation.budget_note = warning_message
                else:
                    print("Budget Check Passed: Estimated cost is within budget + subsidy.")
                    # budget_note remains None if check passes

            else:
                 print("Warning: Could not parse all cost/subsidy values for budget check. Skipping budget note.")

        except Exception as budget_check_error:
            print(f"Warning: Error during budget check: {budget_check_error}")
            # Don't raise an exception here, just log it. The recommendation itself is valid.
            # Ensure budget_note remains None or its current state if an error occurs here.

        # execution_time = time.time() - start_time # Can be calculated and returned if needed

        return recommendation

    # Removed FileNotFoundError handling for context files as they are no longer read directly
    except HTTPException as http_exc:
        raise http_exc # Re-raise HTTP exceptions from parsing retries or retriever init
    except Exception as e:
        # Log the error internally
        print(f"Error in generate_recommendation: {e}") # Added print for debugging
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")

