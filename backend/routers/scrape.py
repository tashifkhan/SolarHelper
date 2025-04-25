import time
from fastapi import APIRouter, HTTPException

from models.requests import ScraperRequest
from models.responses import ScraperResponse
from services.scrape_service import return_awaited_md, prompt_generator
from services.llm_service import llm_prompt_response

router = APIRouter()

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
        # Or return a ScraperResponse with error:
        # return ScraperResponse(
        #     success=False,
        #     error=str(e),
        #     execution_time=execution_time
        # )
