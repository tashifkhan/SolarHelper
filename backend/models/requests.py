from pydantic import BaseModel, Field
from typing import Optional, List
from .responses import ChatHistoryItem

class ScraperRequest(BaseModel):
    url: str
    prompt: str
    timeout: Optional[int] = 300

class SubsidyQuery(BaseModel):
    prompt: str 
    timeout: Optional[int] = 300
    response: List[ChatHistoryItem] = [] 

class RecommendationRequest(BaseModel):
    pin: str
    district_state: str
    roof_size: float  
    monthly_bill: float  
    budget: float  
    timeout: Optional[int] = 300

class PowerPredictionFeatures(BaseModel):
    temperature_2_m_above_gnd: float = Field(default=15.068111)
    relative_humidity_2_m_above_gnd: float = Field(default=51.361025)
    mean_sea_level_pressure_MSL: float = Field(default=1019.337812)
    total_precipitation_sfc: float = Field(default=0.031759)
    snowfall_amount_sfc: float = Field(default=0.002808) 
    total_cloud_cover_sfc: float = Field(default=34.056990)
    high_cloud_cover_high_cld_lay: float = Field(default=14.458818)
    medium_cloud_cover_mid_cld_lay: float = Field(default=20.023499)
    low_cloud_cover_low_cld_lay: float = Field(default=21.373368)
    shortwave_radiation_backwards_sfc: float = Field(default=387.759036)
    wind_speed_10_m_above_gnd: float = Field(default=16.228787)
    wind_direction_10_m_above_gnd: float = Field(default=195.078452)
    wind_speed_80_m_above_gnd: float = Field(default=18.978483)
    wind_direction_80_m_above_gnd: float = Field(default=191.166862)
    wind_speed_900_mb: float = Field(default=16.363190)
    wind_direction_900_mb: float = Field(default=192.447911)
    wind_gust_10_m_above_gnd: float = Field(default=20.583489)
    angle_of_incidence: float = Field(default=50.837490)
    zenith: float = Field(default=59.980947)
    azimuth: float = Field(default=169.167651)

    class Config:
        json_schema_extra = {
            "example": {
                "temperature_2_m_above_gnd": 15.068111,
                "relative_humidity_2_m_above_gnd": 51.361025,
                "mean_sea_level_pressure_MSL": 1019.337812,
                "total_precipitation_sfc": 0.031759,
                "snowfall_amount_sfc": 0.002808,
                "total_cloud_cover_sfc": 34.056990,
                "high_cloud_cover_high_cld_lay": 14.458818,
                "medium_cloud_cover_mid_cld_lay": 20.023499,
                "low_cloud_cover_low_cld_lay": 21.373368,
                "shortwave_radiation_backwards_sfc": 387.759036,
                "wind_speed_10_m_above_gnd": 16.228787,
                "wind_direction_10_m_above_gnd": 195.078452,
                "wind_speed_80_m_above_gnd": 18.978483,
                "wind_direction_80_m_above_gnd": 191.166862,
                "wind_speed_900_mb": 16.363190,
                "wind_direction_900_mb": 192.447911,
                "wind_gust_10_m_above_gnd": 20.583489,
                "angle_of_incidence": 50.837490,
                "zenith": 59.980947,
                "azimuth": 169.167651
            }
        }

class PowerPredictionRequest(BaseModel):
    features: PowerPredictionFeatures
