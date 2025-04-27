from fastapi import HTTPException 
import os
import pickle
import pandas as pd
from models.requests import PowerPredictionFeatures 


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'prediction_models') 


def load_object(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Model or preprocessor file not found at: {file_path}")
    try:
        with open(file_path, "rb") as file_obj:
            return pickle.load(file_obj)
    except Exception as e:
        print(f"Error loading object from {file_path}: {e}")
        raise 

def predict(features: PowerPredictionFeatures) -> float: 
    try:
        model_path = os.path.join(MODEL_DIR, "prediction_model.pkl")
        preprocessor_path = os.path.join(MODEL_DIR, 'preprocessing_model.pkl')

        print(f"Loading model from: {model_path}")
        print(f"Loading preprocessor from: {preprocessor_path}")

        model = load_object(file_path=model_path)
        preprocessor = load_object(file_path=preprocessor_path)

        features_dict = features.model_dump()
        features_df = pd.DataFrame([features_dict])

        print("Input Features DataFrame:")
        print(features_df)

        processed_features = preprocessor.transform(features_df)

        print("Processed Features:")
        print(processed_features)

        preds_scaled = model.predict(processed_features)

        print(f"Scaled Prediction: {preds_scaled}")

        result_value = float(preds_scaled[0])

        print(f"Final Predicted Value: {result_value}")
        return result_value

    except FileNotFoundError as e:
         print(f"Error: {e}")
         raise HTTPException(status_code=500, detail=str(e))
    
    except ModuleNotFoundError as e:
        error_detail = f"Missing required library: {e}. Please ensure it is installed in the environment."
        print(f"Error during prediction: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Error during prediction processing: {str(e)}")
