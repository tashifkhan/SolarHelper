from fastapi import APIRouter, HTTPException

# Change relative imports to absolute
from models.requests import SubsidyQuery
from models.responses import ChatResponse
from services.chat_service import process_subsidy_enquiry, process_general_solar_enquiry

router = APIRouter()

@router.post("/subsidy-enquiry", response_model=ChatResponse)
async def subsidy_enquiry(request: SubsidyQuery):
    """
    Process a subsidy enquiry chat request.
    """
    try:
        return process_subsidy_enquiry(request)
    except HTTPException as e:
        raise e # Re-raise HTTP exceptions from the service
    except Exception as e:
        # Log the error internally
        print(f"Error in subsidy enquiry endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during subsidy enquiry.")

@router.post("/general-solar-enquiry", response_model=ChatResponse)
async def general_solar_enquiry(request: SubsidyQuery):
    """
    Process a general solar energy enquiry chat request.
    """
    try:
        return process_general_solar_enquiry(request)
    except HTTPException as e:
        raise e # Re-raise HTTP exceptions from the service
    except Exception as e:
        # Log the error internally
        print(f"Error in general solar enquiry endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during general solar enquiry.")
