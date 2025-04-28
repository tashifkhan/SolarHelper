from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.power_pipeline import PredictPipeline
from models.requests import PowerPredictionRequest, LocationRequest, PowerPredictionFeatures
import pandas as pd
import httpx

from routers import scrape, chat, recommendation

app = FastAPI(
    title="Solar Helper Backend",
    description="FastAPI backend for Solar Helper.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(scrape.router, tags=["Scraping"])
app.include_router(chat.router, tags=["Chat"])
app.include_router(recommendation.router, tags=["Recommendation"])
# app.include_router(power_prediction.router, tags=["Power Prediction"])

@app.get("/")
async def root():
    return {"message": "Solar Helper Backend is running"}

@app.get("/check")
async def check():
    return {"status": "ok"}


@app.post("/power_prediction", tags=["Power Prediction"])
async def power_prediction(request: PowerPredictionRequest):
    try:
        print("Parsed request:", request)
        df = pd.DataFrame([request.features.dict()])
        print("DataFrame created:", df)
        pipeline = PredictPipeline()
        print("Pipeline initialized")
        pred = pipeline.predict(df)
        print("Prediction made:", pred)
        return {"predicted_power": pred}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/energy_by_location")
async def energy_by_location(request: LocationRequest):
    """
    Fetches weather data for given latitude and longitude, then predicts power output.
    Also fetches daily sunshine duration.
    """
    try:
        # Fetch weather data from Open-Meteo API
        # Added daily=sunshine_duration parameter
        url = (
            f"https://api.open-meteo.com/v1/forecast?latitude={request.latitude}&longitude={request.longitude}"
            "&hourly=temperature_2m,relative_humidity_2m,pressure_msl,precipitation,snowfall,"
            "cloud_cover,cloud_cover_high,cloud_cover_mid,cloud_cover_low,shortwave_radiation,"
            "wind_speed_10m,wind_direction_10m,wind_gusts_10m"
            "&current=temperature_2m,wind_speed_10m,wind_direction_10m"
            "&daily=sunshine_duration&timezone=UTC"  # Added daily sunshine duration
        )
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        # Extract features for prediction
        # Corrected variable names in hourly and current parameters again
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

