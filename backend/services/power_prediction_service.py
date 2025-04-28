from fastapi import HTTPException
import os
import pickle
import pandas as pd
import traceback 



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'prediction_models')


def load_object(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Model or preprocessor file not found at: {file_path}")
    try:
        print(f"Attempting to load: {file_path}")  
        with open(file_path, "rb") as file_obj:
            loaded_obj = pickle.load(file_obj)
        print(f"Successfully loaded: {file_path}")  
        return loaded_obj
    except Exception as e:
        print(f"Error loading object from {file_path}: {e}")
        raise


def predict(features) -> float:
    try:
        preprocessor_path = os.path.join(MODEL_DIR, 'preprocessing_inputs.pkl')  
        output_transformer_path = os.path.join(MODEL_DIR, 'preprocessing_output.pkl') 
        model_path = os.path.join(MODEL_DIR, "prediction_model.pkl")

        model = load_object(file_path=model_path)

        preprocessor = load_object(file_path=preprocessor_path)

        output_transformer = load_object(file_path=output_transformer_path)

        # Convert input features to DataFrame
        if isinstance(features, dict):
            features_dict = features
        elif hasattr(features, "model_dump"):  
            features_dict = features.model_dump()
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid features input: must be dict or model with model_dump()"
            )
        features_df = pd.DataFrame([features_dict])
        print(features_df.head())  # Log head for confirmation

        # Preprocess features
        processed_X = preprocessor.transform(features_df)

        # Predict using the model
        preds_scaled = model.predict(processed_X)

        # Inverse transform the prediction
        result_value_array = output_transformer.inverse_transform(preds_scaled.reshape(-1, 1))
        result_value = float(result_value_array[0][0])

        return {"predicted_power":result_value}

    except FileNotFoundError as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    except ModuleNotFoundError as e:
        error_detail = f"Missing required library: {e}. Please ensure it is installed in the environment."
        print(f"Error during prediction: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

    except Exception as e:
        print(f"Error during prediction: {e}")
        print("--- Traceback ---")  # Added marker
        print(traceback.format_exc())  # Print detailed traceback
        print("--- End Traceback ---")  # Added marker
        raise HTTPException(status_code=500, detail=f"Error during prediction processing: {str(e)}")


if __name__ == "__main__":
    # Example usage matching the new structure
    input_features = {
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
    # No need to create DataFrame here, the predict function handles it
    # features_df = pd.DataFrame([input_features])
    # print("Input DataFrame for testing:")
    # print(features_df)
    try:
        result = predict(input_features)
        print(f"Predicted Output: {result}")
    except Exception as e:
        print(f"Error during test prediction: {e}")