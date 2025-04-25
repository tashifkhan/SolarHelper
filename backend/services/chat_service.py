import os
import time
from typing import List
from fastapi import HTTPException

from models.requests import SubsidyQuery
from models.responses import ChatResponse, ChatHistoryItem
from services.llm_service import llm_prompt_response

def process_subsidy_enquiry(request: SubsidyQuery) -> ChatResponse:
    start_time = time.time()
    try:
        # 1. Read static subsidy context
        # Use relative path from the service file location
        base_path = os.path.dirname(__file__)
        context_path = os.path.join(base_path, '..', 'context', 'subsidy_info.md')  # Adjusted to context folder
        with open(context_path, "r") as ft:
            subsidy_context = ft.read()

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

        # 4. Generate the AI response
        ai_answer = llm_prompt_response(system_prompt)
        execution_time = time.time() - start_time

        # 5. Update conversation history
        updated_history = request.response + [ChatHistoryItem(prompt=request.prompt, answer=ai_answer)]

        return ChatResponse(answer=ai_answer, prev_responses=updated_history, execution_time=execution_time)

    except FileNotFoundError:
         raise HTTPException(status_code=500, detail="Subsidy context file not found.")
    except Exception as e:
        # Log the error internally if needed
        raise HTTPException(status_code=500, detail=f"Error processing subsidy enquiry: {str(e)}")


def process_general_solar_enquiry(request: SubsidyQuery) -> ChatResponse:
    start_time = time.time()
    try:
        # Use relative path from the service file location
        base_path = os.path.dirname(__file__)
        subsidy_context_path = os.path.join(base_path, '..', 'context', 'subsidy_info.md')
        general_context_path = os.path.join(base_path, '..', 'context', 'general_solar_context.md')

        # 1. Read static context from both files
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

        # 4. Generate the AI response
        ai_answer = llm_prompt_response(system_prompt)
        execution_time = time.time() - start_time

        # 5. Update conversation history
        updated_history = request.response + [ChatHistoryItem(prompt=request.prompt, answer=ai_answer)]

        return ChatResponse(answer=ai_answer, prev_responses=updated_history, execution_time=execution_time)

    except Exception as e:
         # Log the error internally if needed
        raise HTTPException(status_code=500, detail=f"Error processing general solar enquiry: {str(e)}")

