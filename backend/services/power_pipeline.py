import os
import pickle

class PredictPipeline:
    def init(self):
        pass


    def predict(self, features):
        try:
            BASE_DIR = os.path.dirname(os.path.abspath(__file__))
            MODEL_DIR = os.path.join(BASE_DIR, '..', 'prediction_models') 
            model_path = os.path.join(MODEL_DIR, "prediction_model.pkl")
            preprocessor_path = os.path.join(MODEL_DIR, 'preprocessing_inputs.pkl')
            model = self.load_object(file_path=model_path)
            preprocessor = self.load_object(file_path=preprocessor_path)
            output_transformer_path = os.path.join(MODEL_DIR, 'preprocessing_output.pkl')
            output_transformer = self.load_object(file_path=output_transformer_path)
            features = preprocessor.transform(features)
            preds = model.predict(features)
            result = output_transformer.inverse_transform(preds.reshape(-1, 1))
            return result[0][0]
        
        except Exception as e:
            raise
        
    def load_object(self, file_path):
        try:
            with open(file_path, "rb") as file_obj:
                return pickle.load(file_obj)

        except Exception as e:
            raise


if __name__ == "__main__":
    pipeline = PredictPipeline()
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
    print(features_df)
    result = pipeline.predict(features_df)
    print(result)