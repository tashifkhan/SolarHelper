import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import time
import os
import re
import pandas as pd
from services.power_pipeline import PredictPipeline
from models.requests import PowerPredictionRequest

from routers import scrape, chat, recommendation

app = FastAPI(
    title="Solar Helper Backend",
    description="FastAPI backend for Solar Helper.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(scrape.router, tags=["Scraping"])
app.include_router(chat.router, tags=["Chat"])
app.include_router(recommendation.router, tags=["Recommendation"])

@app.get("/")
async def root():
    return {"message": "Solar Helper Backend is running"}

@app.get("/check")
async def check():
    return {"status": "ok"}

@app.post("/power_prediction", tags=["Power Prediction"])
async def power_prediction(request: PowerPredictionRequest):
    try:
        df = pd.DataFrame([request.features.dict()])
        pipeline = PredictPipeline()
        pred = pipeline.predict(df)
        return {"predicted_power": pred}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

