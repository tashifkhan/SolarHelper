import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import scrape, chat, recommendation, power_prediction

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

