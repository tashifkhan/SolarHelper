import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import time
import os
import re

from routers import scrape, chat, recommendation, power_prediction

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
app.include_router(power_prediction.router, tags=["Power Prediction"])

@app.get("/")
async def root():
    return {"message": "Solar Helper Backend is running"}

@app.get("/check")
async def check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

