from fastapi import APIRouter, HTTPException
import pandas as pd
from models.requests import PowerPredictionRequest
from services.power_pipeline import PredictPipeline

router = APIRouter()

@router.post("/power_prediction")
async def power_prediction(request: PowerPredictionRequest):
    """
    Accepts weather and solar features and predicts the power output using a pipeline.
    """
    try:
        print("Parsed request:", request)
        df = pd.DataFrame([request.features.dict()])
        print("DataFrame created:", df)
        pipeline = PredictPipeline()
        print("Pipeline initialized")
        pred = pipeline.predict(df)
        print("Prediction made:", pred)
        return {"predicted_power": pred[0] if isinstance(pred, (list, pd.Series, pd.DataFrame)) else pred}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in power_prediction endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during power prediction: {str(e)}")

