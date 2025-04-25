\
from pydantic import BaseModel
from typing import Optional, List
from .responses import ChatHistoryItem # Import ChatHistoryItem from responses

class ScraperRequest(BaseModel):
    url: str
    prompt: str
    timeout: Optional[int] = 300

class SubsidyQuery(BaseModel):
    prompt: str  # User's current question/message
    timeout: Optional[int] = 300
    response: List[ChatHistoryItem] = [] # Use the imported ChatHistoryItem

class RecommendationRequest(BaseModel):
    pin: str
    district_state: str
    roof_size: float  # e.g., "500"
    monthly_bill: float  # e.g., "₹2500"
    budget: float  # e.g., "₹5,00,000"
    timeout: Optional[int] = 300
