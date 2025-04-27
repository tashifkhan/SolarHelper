from fastapi import APIRouter, HTTPException

from models.requests import SubsidyQuery
from models.responses import ChatResponse

from services.chat_service import process_chat_enquiry

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: SubsidyQuery):
    """
    Process a chat request using the RAG system.
    """
    try:
        return process_chat_enquiry(request)
    except HTTPException as e:
        raise e # Re-raise HTTP exceptions from the service
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during chat processing.")
