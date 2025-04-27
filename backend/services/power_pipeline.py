import os
import pickle
import sys
import pandas as pd
import sklearn
import lightgbm as lgb
import numpy as np

class PredictPipeline:
    def __init__(self):
        print("--- Library Versions ---")
        print(f"Python: {sys.version}")
        print(f"Pandas: {pd.__version__}")
        print(f"Scikit-learn: {sklearn.__version__}")
        print(f"LightGBM: {lgb.__version__}")
        print(f"Numpy: {np.__version__}")
        print("-----------------------")
        print("Pipeline initialized")

    def predict(self, features):
        model = None
        preprocessor = None
        output_transformer = None
        try:
            # Ensure the path to the models directory is absolute and correctly resolved
            SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
            MODEL_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', 'prediction_models'))

            model_path = os.path.join(MODEL_DIR, "prediction_model.pkl")
            preprocessor_path = os.path.join(MODEL_DIR, 'preprocessing_inputs.pkl')
            output_transformer_path = os.path.join(MODEL_DIR, 'preprocessing_output.pkl')

            print(f"Attempting to load model from: {model_path}")
            model = self.load_object(file_path=model_path)
            print(f"Successfully loaded model: {type(model)}")

            print(f"Attempting to load preprocessor from: {preprocessor_path}")
            preprocessor = self.load_object(file_path=preprocessor_path)
            print(f"Successfully loaded preprocessor: {type(preprocessor)}")

            print(f"Attempting to load output transformer from: {output_transformer_path}")
            output_transformer = self.load_object(file_path=output_transformer_path)
            print(f"Successfully loaded output transformer: {type(output_transformer)}")

            print(f"Input features shape: {features.shape}")
            print("Attempting to transform features...")
            transformed_features = preprocessor.transform(features)
            print(f"Successfully transformed features. Shape: {transformed_features.shape}")

            print("Attempting to predict...")
            preds = model.predict(transformed_features)
            print(f"Successfully predicted. Shape: {preds.shape}")

            print("Attempting to inverse transform predictions...")
            # Ensure preds is 2D for inverse_transform
            if preds.ndim == 1:
                preds = preds.reshape(-1, 1)
            result = output_transformer.inverse_transform(preds)
            print(f"Successfully inverse transformed. Shape: {result.shape}")

            final_prediction = result[0][0]
            print(f"Final prediction: {final_prediction}")
            return final_prediction

        except FileNotFoundError as e:
            print(f"ERROR: File not found - {e}")
            raise
        except pickle.UnpicklingError as e:
            print(f"ERROR: Failed to unpickle file. It might be corrupted or incompatible. - {e}")
            raise
        except ImportError as e:
             print(f"ERROR: Import error during unpickling. Check library versions. - {e}")
             raise
        except AttributeError as e:
            print(f"ERROR: Attribute error during unpickling or prediction. Check model/preprocessor compatibility. - {e}")
            if model is None: print("Model object might be None.")
            if preprocessor is None: print("Preprocessor object might be None.")
            if output_transformer is None: print("Output transformer object might be None.")
            raise
        except Exception as e:
            print(f"ERROR: An unexpected error occurred in predict pipeline: {type(e).__name__} - {e}")
            if 'transform' in str(e).lower():
                 print("Error likely occurred during preprocessor.transform()")
            elif 'predict' in str(e).lower():
                 print("Error likely occurred during model.predict()")
            elif 'inverse_transform' in str(e).lower():
                 print("Error likely occurred during output_transformer.inverse_transform()")
            raise

    def load_object(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Object file not found at: {file_path}")
        print(f"Loading object from: {file_path}")
        try:
            with open(file_path, "rb") as file_obj:
                obj = pickle.load(file_obj)
                print(f"Successfully loaded object of type: {type(obj)}")
                return obj
        except pickle.UnpicklingError as e:
            print(f"ERROR during unpickling {file_path}: {e}. File might be corrupt or incompatible.")
            raise
        except ImportError as e:
             print(f"ERROR during unpickling {file_path} due to missing class/module: {e}")
             raise
        except Exception as e:
            print(f"ERROR: Unexpected error loading object from {file_path}: {type(e).__name__} - {e}")
            raise


if __name__ == "__main__":
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
    import pandas as pd

    features_df = pd.DataFrame([input_features])
    print("--- Running __main__ ---")
    pipeline = PredictPipeline()
    print("Input DataFrame:")
    print(features_df)
    try:
        result = pipeline.predict(features_df)
        print(f"Prediction Result: {result}")
    except Exception as e:
        print(f"--- CRASH IN __main__ ---")
        print(f"An error occurred: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()
    print("--- Finished __main__ ---")