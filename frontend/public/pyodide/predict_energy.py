import os
import pickle
import sys
import pandas as pd
import sklearn
import lightgbm as lgb
import numpy as np
import json
from pyodide.http import pyfetch

# --- Global Variables ---
# Base URL for fetching model files (assuming they are served alongside this script)
# Adjust this if models are hosted elsewhere
MODEL_BASE_URL = "/pyodide/models/" # Relative path assuming models are in /public/pyodide/models/
PREDICTION_MODEL_URL = f"{MODEL_BASE_URL}prediction_model.pkl"
PREPROCESSOR_URL = f"{MODEL_BASE_URL}preprocessing_inputs.pkl"
OUTPUT_TRANSFORMER_URL = f"{MODEL_BASE_URL}preprocessing_output.pkl"

# --- Model Loading Cache ---
# Cache loaded models/objects to avoid refetching on subsequent calls
loaded_objects_cache = {}

# --- Power Prediction Features (Mimicking Pydantic for structure) ---
# Define expected features - adjust defaults as needed
class PowerPredictionFeatures:
    def __init__(self, **kwargs):
        self.temperature_2_m_above_gnd = kwargs.get("temperature_2_m_above_gnd", 15.0)
        self.relative_humidity_2_m_above_gnd = kwargs.get("relative_humidity_2_m_above_gnd", 50.0)
        self.mean_sea_level_pressure_MSL = kwargs.get("mean_sea_level_pressure_MSL", 1013.0)
        self.total_precipitation_sfc = kwargs.get("total_precipitation_sfc", 0.0)
        self.snowfall_amount_sfc = kwargs.get("snowfall_amount_sfc", 0.0)
        self.total_cloud_cover_sfc = kwargs.get("total_cloud_cover_sfc", 50.0)
        self.high_cloud_cover_high_cld_lay = kwargs.get("high_cloud_cover_high_cld_lay", 10.0)
        self.medium_cloud_cover_mid_cld_lay = kwargs.get("medium_cloud_cover_mid_cld_lay", 20.0)
        self.low_cloud_cover_low_cld_lay = kwargs.get("low_cloud_cover_low_cld_lay", 20.0)
        self.shortwave_radiation_backwards_sfc = kwargs.get("shortwave_radiation_backwards_sfc", 400.0)
        self.wind_speed_10_m_above_gnd = kwargs.get("wind_speed_10_m_above_gnd", 5.0)
        self.wind_direction_10_m_above_gnd = kwargs.get("wind_direction_10_m_above_gnd", 180.0)
        self.wind_speed_80_m_above_gnd = kwargs.get("wind_speed_80_m_above_gnd", 6.0) # Often approximated if not available
        self.wind_direction_80_m_above_gnd = kwargs.get("wind_direction_80_m_above_gnd", 180.0) # Often approximated
        self.wind_speed_900_mb = kwargs.get("wind_speed_900_mb", 7.0) # Often approximated
        self.wind_direction_900_mb = kwargs.get("wind_direction_900_mb", 180.0) # Often approximated
        self.wind_gust_10_m_above_gnd = kwargs.get("wind_gust_10_m_above_gnd", 8.0)
        self.angle_of_incidence = kwargs.get("angle_of_incidence", 45.0) # Placeholder default
        self.zenith = kwargs.get("zenith", 60.0) # Placeholder default
        self.azimuth = kwargs.get("azimuth", 180.0) # Placeholder default

    def dict(self):
        return self.__dict__

# --- Prediction Pipeline ---
class PredictPipeline:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.output_transformer = None
        print("--- Library Versions ---")
        print(f"Python: {sys.version}")
        print(f"Pandas: {pd.__version__}")
        print(f"Scikit-learn: {sklearn.__version__}")
        print(f"LightGBM: {lgb.__version__}")
        print(f"Numpy: {np.__version__}")
        print("-----------------------")
        print("Pipeline initialized")

    async def load_resources(self):
        """Loads necessary pickle files asynchronously."""
        try:
            print("Loading prediction resources...")
            self.model = await self.load_object(PREDICTION_MODEL_URL)
            self.preprocessor = await self.load_object(PREPROCESSOR_URL)
            self.output_transformer = await self.load_object(OUTPUT_TRANSFORMER_URL)
            print("Prediction resources loaded successfully.")
            return True
        except Exception as e:
            print(f"ERROR: Failed to load prediction resources: {type(e).__name__} - {e}")
            return False

    async def load_object(self, url):
        """Fetches a pickle file from a URL and loads it."""
        if url in loaded_objects_cache:
            print(f"Using cached object for {url}")
            return loaded_objects_cache[url]

        print(f"Fetching object from: {url}")
        try:
            response = await pyfetch(url)
            if response.status == 200:
                pickle_bytes = await response.bytes()
                obj = pickle.loads(pickle_bytes)
                print(f"Successfully loaded object of type: {type(obj)} from {url}")
                loaded_objects_cache[url] = obj # Cache the loaded object
                return obj
            else:
                raise FileNotFoundError(f"Object file not found at: {url} (Status: {response.status})")
        except pickle.UnpicklingError as e:
            print(f"ERROR during unpickling {url}: {e}. File might be corrupt or incompatible.")
            raise
        except ImportError as e:
             print(f"ERROR during unpickling {url} due to missing class/module: {e}")
             raise
        except Exception as e:
            print(f"ERROR: Unexpected error loading object from {url}: {type(e).__name__} - {e}")
            raise

    def predict(self, features_df):
        """Performs prediction on the input DataFrame."""
        if not self.model or not self.preprocessor or not self.output_transformer:
             raise RuntimeError("Prediction resources not loaded. Call load_resources() first.")

        try:
            print(f"Input features shape: {features_df.shape}")
            print("Attempting to transform features...")
            transformed_features = self.preprocessor.transform(features_df)
            print(f"Successfully transformed features. Shape: {transformed_features.shape}")

            print("Attempting to predict...")
            preds = self.model.predict(transformed_features)
            print(f"Successfully predicted. Shape: {preds.shape}")

            print("Attempting to inverse transform predictions...")
            if preds.ndim == 1:
                preds = preds.reshape(-1, 1)
            result = self.output_transformer.inverse_transform(preds)
            print(f"Successfully inverse transformed. Shape: {result.shape}")

            final_prediction = result[0][0]
            print(f"Final prediction: {final_prediction}")
            return final_prediction

        except Exception as e:
            print(f"ERROR: An unexpected error occurred in predict pipeline: {type(e).__name__} - {e}")
            if 'transform' in str(e).lower():
                 print("Error likely occurred during preprocessor.transform()")
            elif 'predict' in str(e).lower():
                 print("Error likely occurred during model.predict()")
            elif 'inverse_transform' in str(e).lower():
                 print("Error likely occurred during output_transformer.inverse_transform()")
            raise

# --- Main Prediction Function (Callable from JavaScript) ---
async def predict_energy_for_location(latitude, longitude):
    """
    Fetches weather data for given coordinates, loads models (if not cached),
    and predicts power output and energy generated.
    """
    print(f"Starting prediction for Lat: {latitude}, Lon: {longitude}")
    pipeline = PredictPipeline()

    # Load models/preprocessors asynchronously (will use cache if already loaded)
    resources_loaded = await pipeline.load_resources()
    if not resources_loaded:
        return {"error": "Failed to load prediction models."}

    try:
        # Fetch weather data from Open-Meteo API using pyfetch
        print("Fetching weather data...")
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}"
            "&hourly=temperature_2m,relative_humidity_2m,pressure_msl,precipitation,snowfall,"
            "cloud_cover,cloud_cover_high,cloud_cover_mid,cloud_cover_low,shortwave_radiation,"
            "wind_speed_10m,wind_direction_10m,wind_gusts_10m"
            "&current=temperature_2m,wind_speed_10m,wind_direction_10m"
            "&daily=sunshine_duration&timezone=UTC"
        )
        response = await pyfetch(weather_url)

        if response.status != 200:
             error_text = await response.string()
             print(f"HTTP Error from weather API: {response.status} - {error_text}")
             return {"error": f"Error fetching weather data: {response.status}"}

        data = await response.json()
        print("Weather data fetched successfully.")

        # Extract features for prediction
        features = {}
        current_data = data.get("current", {})
        hourly_data = data.get("hourly", {})

        # Helper to get first item from list or default
        def get_first_or_default(data_dict, key, default=None):
            return data_dict.get(key, [default])[0]

        features["temperature_2_m_above_gnd"] = current_data.get("temperature_2m")
        features["wind_speed_10_m_above_gnd"] = current_data.get("wind_speed_10m")
        features["wind_direction_10_m_above_gnd"] = current_data.get("wind_direction_10m")

        features["relative_humidity_2_m_above_gnd"] = get_first_or_default(hourly_data, "relative_humidity_2m")
        features["mean_sea_level_pressure_MSL"] = get_first_or_default(hourly_data, "pressure_msl")
        features["total_precipitation_sfc"] = get_first_or_default(hourly_data, "precipitation")
        features["snowfall_amount_sfc"] = get_first_or_default(hourly_data, "snowfall")
        features["total_cloud_cover_sfc"] = get_first_or_default(hourly_data, "cloud_cover")
        features["high_cloud_cover_high_cld_lay"] = get_first_or_default(hourly_data, "cloud_cover_high")
        features["medium_cloud_cover_mid_cld_lay"] = get_first_or_default(hourly_data, "cloud_cover_mid")
        features["low_cloud_cover_low_cld_lay"] = get_first_or_default(hourly_data, "cloud_cover_low")
        features["shortwave_radiation_backwards_sfc"] = get_first_or_default(hourly_data, "shortwave_radiation")
        features["wind_gust_10_m_above_gnd"] = get_first_or_default(hourly_data, "wind_gusts_10m")

        # Handle potential None values before creating the DataFrame
        valid_features = {}
        for key, value in features.items():
            if value is None:
                print(f"Warning: Missing weather data for {key}, using default from PowerPredictionFeatures.")
                # Let PowerPredictionFeatures handle default
            else:
                valid_features[key] = value

        # Approximate missing levels if needed (using defaults from PowerPredictionFeatures if 10m is also missing)
        if "wind_speed_10_m_above_gnd" in valid_features:
             valid_features["wind_speed_80_m_above_gnd"] = valid_features["wind_speed_10_m_above_gnd"]
             valid_features["wind_direction_80_m_above_gnd"] = valid_features.get("wind_direction_10_m_above_gnd")
             valid_features["wind_speed_900_mb"] = valid_features["wind_speed_10_m_above_gnd"]
             valid_features["wind_direction_900_mb"] = valid_features.get("wind_direction_10_m_above_gnd")
        # angle_of_incidence, zenith, azimuth will use defaults from PowerPredictionFeatures

        # Create features object and DataFrame
        features_model = PowerPredictionFeatures(**valid_features)
        df = pd.DataFrame([features_model.dict()])

        # Perform prediction
        pred = pipeline.predict(df)

        # Extract sunshine duration
        daily_data = data.get("daily", {})
        sunshine_duration_seconds = get_first_or_default(daily_data, "sunshine_duration")
        sunshine_duration_hours = None
        if sunshine_duration_seconds is not None:
            sunshine_duration_hours = sunshine_duration_seconds / 3600
            print(f"Sunshine duration: {sunshine_duration_hours:.2f} hours")
        else:
            print("Warning: Sunshine duration data not available.")

        # Calculate estimated energy generated
        # Using average daylight hours (e.g., 6) as a fallback if sunshine duration is missing
        # Adjust the fallback multiplier (3 below) based on typical conditions or model assumptions
        effective_hours = sunshine_duration_hours if sunshine_duration_hours is not None else 6
        # The division by 2.5 or multiplication by 3 seems arbitrary without context.
        # Let's assume 'pred' is average power (kW) and we multiply by hours for kWh.
        # Using a simple multiplication for now. Revisit the 2.5/3 factor if it has specific meaning.
        energy_generated = pred * effective_hours
        print(f"Predicted Avg Power: {pred:.2f} kW, Estimated Energy: {energy_generated:.2f} kWh (using {effective_hours:.2f} effective hours)")


        # Return results as a dictionary (convert numpy types if necessary)
        result_dict = {
            "predicted_power": float(pred) if isinstance(pred, (np.number, np.ndarray)) else pred,
            "sunshine_duration_hours": float(sunshine_duration_hours) if sunshine_duration_hours is not None else None,
            "energy_generated": float(energy_generated) if isinstance(energy_generated, (np.number, np.ndarray)) else energy_generated,
            "weather_data_used": valid_features # Optionally return the features used
        }
        # Convert numpy types in weather data just in case
        for key, val in result_dict["weather_data_used"].items():
             if isinstance(val, np.number):
                 result_dict["weather_data_used"][key] = float(val)

        return result_dict

    except Exception as e:
        print(f"Error in predict_energy_for_location: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()
        return {"error": f"Prediction failed: {e}"}

print("predict_energy.py loaded")
