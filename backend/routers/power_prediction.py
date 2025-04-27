from fastapi import APIRouter, HTTPException
import pandas as pd
import httpx  
from models.requests import PowerPredictionRequest, PowerPredictionFeatures, LocationRequest

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

@router.post("/energy_by_location")
async def energy_by_location(request: LocationRequest):
    """
    Fetches weather data for given latitude and longitude, then predicts power output.
    """
    try:
        # Fetch weather data from Open-Meteo API
        # Corrected variable names in hourly and current parameters again
        url = (
            f"https://api.open-meteo.com/v1/forecast?latitude={request.latitude}&longitude={request.longitude}"
            "&hourly=temperature_2m,relative_humidity_2m,pressure_msl,precipitation,snowfall,"
            "cloud_cover,cloud_cover_high,cloud_cover_mid,cloud_cover_low,shortwave_radiation,"
            "wind_speed_10m,wind_direction_10m,wind_gusts_10m"
            "&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=UTC"
        )
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        # Extract features for prediction
        # Adjusted extraction keys to match corrected variable names
        features = {}
        current_data = data.get("current", {})
        features["temperature_2_m_above_gnd"] = current_data.get("temperature_2m")
        features["wind_speed_10_m_above_gnd"] = current_data.get("wind_speed_10m")
        features["wind_direction_10_m_above_gnd"] = current_data.get("wind_direction_10m")

        hourly = data.get("hourly", {})
        # Use first hourly data point if available, otherwise default to 0 or None
        features["relative_humidity_2_m_above_gnd"] = hourly.get("relative_humidity_2m", [None])[0]
        features["mean_sea_level_pressure_MSL"] = hourly.get("pressure_msl", [None])[0]
        features["total_precipitation_sfc"] = hourly.get("precipitation", [None])[0]
        features["snowfall_amount_sfc"] = hourly.get("snowfall", [None])[0]
        features["total_cloud_cover_sfc"] = hourly.get("cloud_cover", [None])[0]
        features["high_cloud_cover_high_cld_lay"] = hourly.get("cloud_cover_high", [None])[0]
        features["medium_cloud_cover_mid_cld_lay"] = hourly.get("cloud_cover_mid", [None])[0]
        features["low_cloud_cover_low_cld_lay"] = hourly.get("cloud_cover_low", [None])[0]
        features["shortwave_radiation_backwards_sfc"] = hourly.get("shortwave_radiation", [None])[0]
        features["wind_gust_10_m_above_gnd"] = hourly.get("wind_gusts_10m", [None])[0]

        # Handle potential None values before creating the DataFrame
        # Replace None with a default value (e.g., 0) or handle appropriately based on model training
        for key, value in features.items():
            if value is None:
                print(f"Warning: Missing weather data for {key}, using default 0.")
                features[key] = 0

        # Approximate missing levels with 10m values if they exist
        features["wind_speed_80_m_above_gnd"] = features.get("wind_speed_10_m_above_gnd", 0)
        features["wind_direction_80_m_above_gnd"] = features.get("wind_direction_10_m_above_gnd", 0)
        features["wind_speed_900_mb"] = features.get("wind_speed_10_m_above_gnd", 0)
        features["wind_direction_900_mb"] = features.get("wind_direction_10_m_above_gnd", 0)
        # angle_of_incidence, zenith, azimuth will use defaults from PowerPredictionFeatures

        # Merge extracted weather features with default solar features
        features_model = PowerPredictionFeatures(**features)
        df = pd.DataFrame([features_model.dict()])
        pipeline = PredictPipeline()
        pred = pipeline.predict(df)
        
        # Extract sunshine duration (in seconds, convert to hours if needed)
        daily_data = data.get("daily", {})
        sunshine_duration_seconds = daily_data.get("sunshine_duration", [None])[0]
        sunshine_duration_hours = None
        if sunshine_duration_seconds is not None:
            sunshine_duration_hours = sunshine_duration_seconds / 3600  

        return {
            "predicted_power": pred,
            "sunshine_duration_hours": sunshine_duration_hours,
            "energy_generated": pred * sunshine_duration_hours / 2.5 if sunshine_duration_hours else pred * 3
        }
    except httpx.HTTPStatusError as e:
        # Log the specific error for debugging
        print(f"HTTP Error from weather API: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {e.response.status_code}")
    except Exception as e:
        print(f"Error in energy_by_location: {type(e).__name__} - {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching weather data or predicting power: {e}")

