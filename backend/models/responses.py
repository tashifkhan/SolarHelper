\
from pydantic import BaseModel
from typing import Optional, List

# Moved from server.py - needed by SubsidyQuery in requests.py
class ChatHistoryItem(BaseModel):
    prompt: Optional[str] = None
    answer: Optional[str] = None

class ScraperResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None
    execution_time: float

class ChatResponse(BaseModel):
    answer: str
    prev_responses: List[ChatHistoryItem]
    execution_time: float

class SolarPanelSetup(BaseModel):
    recommended_capacity: str = "5kW"
    panel_type: str = "Monocrystalline"
    number_of_panels: int = 15
    estimated_cost: str = "₹3,50,000"

class BatterySolution(BaseModel):
    battery_type: str = "Lithium-ion"
    capacity: str = "10kWh"
    backup_duration: str = "8-10 hours"
    estimated_cost: str = "₹2,50,000"

class InstallationDetails(BaseModel):
    installation_time: str = "3-4 days"
    warranty: str = "25 years"
    annual_maintenance: str = "₹5,000"
    subsidy_available: str = "₹94,500"
    subsidy_breakdown: Optional[str] = "Detailed breakdown of subsidy calculation."

class SolarRecommendation(BaseModel):
    solar_panel_setup: SolarPanelSetup
    battery_solution: BatterySolution
    installation_details: InstallationDetails
