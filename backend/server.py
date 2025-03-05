from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
import time

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

class SubsidyQuery(BaseModel):
    query: str
    timeout: Optional[int] = 300

class ScraperResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None
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


@app.post("/subsidy-enquiry", response_model=ScraperResponse)
async def subsidy_enquiry(request: SubsidyQuery):
    """
    Process a subsidy enquiry request.

    This endpoint accepts a query string, reads subsidy information from a markdown file,
    generates a prompt using the query and subsidy context, and returns a response from an LLM.

    - **query**: Question about solar subsidies
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    """
    start_time = time.time()
    try:
        with open("subsidy_info.md", "r") as ft:
            subsidy_context = ft.read()
            ft.close()

        prompt = prompt_generator(subsidy_context, request.query)
        response = llm_prompt_response(prompt)
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
