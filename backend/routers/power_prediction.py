from fastapi import APIRouter, HTTPException, Body
from models.requests import PowerPredictionFeatures
from services import power_prediction_service

router = APIRouter()

@router.post("/predict-power", summary="Predict Solar Power Output")
async def predict_power(
    features: PowerPredictionFeatures = Body(...)
):
    """
    Accepts weather and solar features and predicts the power output.

    Uses default values if specific features are not provided in the request body.
    """
    try:
        # Calls the updated service function
        prediction = power_prediction_service.predict(features)
        return {"predicted_power_output": prediction}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in predict_power endpoint: {e}")

        raise HTTPException(status_code=500, detail=f"An internal error occurred during power prediction: {str(e)}")

