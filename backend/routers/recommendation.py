from fastapi import APIRouter, HTTPException

from models.requests import RecommendationRequest
from models.responses import SolarRecommendation
from services.recommendation_service import generate_recommendation

router = APIRouter()

@router.post("/recommendation", response_model=SolarRecommendation)
async def get_solar_recommendation(request: RecommendationRequest):
    """
    Generate a personalized solar recommendation based on user inputs.
    """
    try:
        return generate_recommendation(request)
    except HTTPException as e:
        raise e # Re-raise HTTP exceptions from the service
    except Exception as e:
        # Log the error internally
        print(f"Error in recommendation endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during recommendation generation.")
