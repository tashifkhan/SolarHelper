import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import List

from models.responses import ScraperResponse
from services.scrape_service import (
    return_awaited_md,
    prompt_generator,  
    extract_and_combine_from_urls,  
    final_analysis_prompt_generator  
)
from services.llm_service import llm_prompt_response

router = APIRouter()

class ScraperRequest(BaseModel):
    url: HttpUrl
    prompt: str
    timeout: int = 300

class MultiScraperRequest(BaseModel):
    urls: List[HttpUrl]
    prompt: str
    timeout: int = 300

@router.post("/scrape", response_model=ScraperResponse)
async def scrape_website(request: ScraperRequest):
    """
    Scrape a website and extract information based on the provided prompt.

    - **url**: URL of the website to scrape
    - **prompt**: Description of what information to extract
    - **timeout**: Maximum time to wait for processing in seconds (default: 300)
    """
    start_time = time.time()

    try:
        # Call scrape service functions
        dom_content = return_awaited_md(request.url)
        full_prompt = prompt_generator(dom_content, request.prompt)

        # Call LLM service function
        response = llm_prompt_response(full_prompt)

        execution_time = time.time() - start_time

        return ScraperResponse(
            success=True,
            data=response,
            execution_time=execution_time
        )

    except Exception as e:
        execution_time = time.time() - start_time
        # Log the error internally if needed
        print(f"Error during scraping: {e}")
        # Return a generic error or re-raise specific HTTP exceptions if caught from services
        raise HTTPException(status_code=500, detail=f"Failed to scrape website: {str(e)}")

@router.post("/scrape-multiple", response_model=ScraperResponse)
async def scrape_multiple_websites(request: MultiScraperRequest):
    """
    Scrapes multiple websites, extracts relevant information from each based on the prompt,
    and then uses an LLM to synthesize the results and list sources.

    - **urls**: List of URLs of the websites to scrape
    - **prompt**: Description of what information to extract from each website's content
    - **timeout**: Maximum time to wait for processing in seconds (default: 300) - Note: This timeout applies to the entire process.
    """
    start_time = time.time()

    if not request.urls:
        raise HTTPException(status_code=400, detail="No URLs provided.")

    try:
        # 1. Scrape each URL and extract info using LLM based on the user prompt
        # Convert HttpUrl objects to strings for the service function
        url_strings = [str(url) for url in request.urls]
        combined_extracted_info = extract_and_combine_from_urls(url_strings, request.prompt)

        if not combined_extracted_info.strip():
             # This might happen if all URLs failed or returned no relevant info
             # Consider returning a specific message or the raw combined_extracted_info
             raise HTTPException(status_code=500, detail="Failed to extract relevant information from any of the provided URLs.")

        # 2. Generate the final prompt for structuring and source listing
        final_prompt = final_analysis_prompt_generator(combined_extracted_info)

        # 3. Call LLM service function *again* for the final analysis
        final_response = llm_prompt_response(final_prompt)

        execution_time = time.time() - start_time

        return ScraperResponse(
            success=True,
            data=final_response,  # This is the final structured analysis from the LLM
            execution_time=execution_time
        )

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions directly
        raise http_exc
    except Exception as e:
        execution_time = time.time() - start_time
        print(f"Error during multi-scraping analysis: {e}")
        # Include details from the exception in the response
        raise HTTPException(status_code=500, detail=f"Failed to process multiple websites: {str(e)}")
