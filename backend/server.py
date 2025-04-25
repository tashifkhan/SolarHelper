from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional, List
import time
import os

from scrapy import (
    return_awaited_md,
    prompt_generator,
    llm_prompt_response
)

app = FastAPI(
    title="LLM Web Scraper API",
    description="API for scraping websites and extracting information using LLM",
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
        # Consider how to handle errors in a chat context. Maybe return an error message within the ChatResponse?
        # For now, re-raising or returning a standard error response might be okay, but FastAPI expects ChatResponse.
        # Let's raise HTTPException for now, which FastAPI handles well.
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
