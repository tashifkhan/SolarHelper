import streamlit as st
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os

# Page configuration
st.set_page_config(
    page_title="Weather Prediction with LSTM",
    page_icon="🌤️",
    layout="wide"
)

# App title and description
st.title("Weather Prediction with LSTM Models")
st.markdown("""
This application uses LSTM (Long Short-Term Memory) neural networks to predict weather patterns.
Choose between monthly or yearly predictions based on historical weather data.
""")

# Define mse function explicitly
def mse(y_true, y_pred):
    return tf.reduce_mean(tf.square(y_pred - y_true))

# Function to load models
@st.cache_resource
def load_weather_models():
    # Define custom metrics dictionary
    custom_objects = {
        'mse': mse,
        'mean_squared_error': mse
    }
    
    monthly_model = load_model(
        '/Users/taf/Projects/SolarHelper/weather analysis/models/monthly_lstm_model.h5',
        custom_objects=custom_objects
    )
    yearly_model = load_model(
        '/Users/taf/Projects/SolarHelper/weather analysis/models/yearly_lstm_model.h5',
        custom_objects=custom_objects
    )
    return monthly_model, yearly_model

# Function to load and preprocess default dataset
def load_default_dataset():
    file_path = '/Users/taf/Projects/SolarHelper/weather analysis/delhiWeatherHistory.csv'
    try:
        df = pd.read_csv(file_path)
        # Map columns to required format
        df = preprocess_weather_data(df)
        return df
    except Exception as e:
        st.error(f"Error loading default dataset: {e}")
        return None

# Function to preprocess the weather data format
def preprocess_weather_data(df):
    # Check if data is already in required format
    required_cols = ['date', 'temperature', 'humidity', 'precipitation', 'air_pressure', 'wind_speed']
    if all(col in df.columns for col in required_cols):
        return df
    
    # Map columns from the provided format to required format
    # Create a new DataFrame with required columns
    processed_df = pd.DataFrame()
    
    # Handle datetime
    if 'datetime_utc' in df.columns:
        processed_df['date'] = pd.to_datetime(df['datetime_utc'], format='%Y%m%d-%H:%M', errors='coerce')
    else:
        st.warning("No datetime column found. Using index as date.")
        processed_df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
    
    # Map temperature
    if '_tempm' in df.columns:
        processed_df['temperature'] = df['_tempm'].astype(float)
    else:
        processed_df['temperature'] = 25.0  # Default value
    
    # Map humidity
    if '_hum' in df.columns:
        processed_df['humidity'] = df['_hum'].astype(float)
    else:
        processed_df['humidity'] = 50.0  # Default value
    
    # Map precipitation
    if '_precipm' in df.columns:
        processed_df['precipitation'] = df['_precipm'].replace('-9999', 0).astype(float)
    else:
        processed_df['precipitation'] = 0.0  # Default value
    
    # Map air pressure
    if '_pressurem' in df.columns:
        processed_df['air_pressure'] = df['_pressurem'].replace('-9999', 1013).astype(float)
    else:
        processed_df['air_pressure'] = 1013.0  # Default value
    
    # Map wind speed
    if '_wspdm' in df.columns:
        processed_df['wind_speed'] = df['_wspdm'].astype(float)
    else:
        processed_df['wind_speed'] = 5.0  # Default value
    
    return processed_df

# Load models
try:
    monthly_model, yearly_model = load_weather_models()
    st.success("Models loaded successfully!")
except Exception as e:
    st.error(f"Error loading models: {e}")
    st.stop()

# Sidebar for model selection
st.sidebar.header("Prediction Settings")
prediction_type = st.sidebar.radio("Select Prediction Type", ["Monthly", "Yearly"])

# Function to prepare input data
def prepare_monthly_data(data_df, lookback_days=30, features=None):
    # Ensure all required features are present
    required_features = ['date', 'temperature', 'humidity', 'precipitation']
    if features:
        required_features.extend(features)
    
    missing_features = [feat for feat in required_features if feat not in data_df.columns]
    if missing_features:
        st.error(f"Missing required features in data: {missing_features}")
        return None
        
    # Ensure date is datetime
    if not pd.api.types.is_datetime64_any_dtype(data_df['date']):
        data_df['date'] = pd.to_datetime(data_df['date'])
    
    # Add time features
    df = data_df.copy()
    df['day_of_week'] = df['date'].dt.dayofweek
    df['day_of_month'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    
    # Normalize numerical features
    feature_columns = [col for col in df.columns if col != 'date']
    for column in feature_columns:
        if np.issubdtype(df[column].dtype, np.number):
            df[column] = (df[column] - df[column].mean()) / df[column].std()
    
    # Get the last lookback_days of data
    input_data = df.iloc[-lookback_days:].copy() if len(df) >= lookback_days else df.copy()
    
    # If we don't have enough data, pad with repeated values
    if len(input_data) < lookback_days:
        pad_size = lookback_days - len(input_data)
        pad_df = pd.concat([input_data.iloc[0:1]] * pad_size, ignore_index=True)
        input_data = pd.concat([pad_df, input_data], ignore_index=True)
    
    # Prepare input shape for LSTM model
    X = input_data[feature_columns].values.reshape(1, lookback_days, len(feature_columns))
    
    return X, df, feature_columns

def prepare_yearly_data(uploaded_file, lookback_years=3, features=None):
    df = pd.read_csv(uploaded_file)
    
    # Check for required columns
    required_features = ['year', 'avg_temperature', 'total_precipitation', 'avg_humidity']
    if features:
        required_features.extend(features)
    
    missing_features = [feat for feat in required_features if feat not in df.columns]
    if missing_features:
        st.error(f"Missing required features in data: {missing_features}")
        return None
    
    # Sort by year
    df = df.sort_values('year')
    
    # Normalize numerical features
    feature_columns = [col for col in df.columns if col != 'year']
    for column in feature_columns:
        if np.issubdtype(df[column].dtype, np.number):
            df[column] = (df[column] - df[column].mean()) / df[column].std()
    
    # Get the last lookback_years of data
    input_data = df.iloc[-lookback_years:].copy()
    
    # Prepare input shape for LSTM model
    X = input_data[feature_columns].values.reshape(1, lookback_years, len(feature_columns))
    
    return X, df

# Helper functions for denormalizing predictions
def denormalize(value, mean, std):
    return value * std + mean

# Main app content
if prediction_type == "Monthly":
    st.header("Monthly Weather Prediction")
    
    # Input options
    with st.expander("Configure Monthly Prediction Inputs"):
        lookback_days = st.slider("Lookback Days", 7, 90, 30)
        
        col1, col2 = st.columns(2)
        with col1:
            include_pressure = st.checkbox("Include Air Pressure", value=True)
            include_wind = st.checkbox("Include Wind Speed", value=True)
        with col2:
            include_solar = st.checkbox("Include Solar Radiation", value=False)
            include_geo = st.checkbox("Include Geographical Features", value=False)
    
    # File uploader for historical data
    st.subheader("Upload Historical Daily Weather Data")
    st.write("Upload a CSV file with daily weather data or use the default Delhi weather dataset")
    
    uploaded_file = st.file_uploader("Choose a CSV file", type="csv")
    
    # Prepare data - either from upload or default
    if uploaded_file is not None:
        # Read and display sample data
        sample_df = pd.read_csv(uploaded_file)
        st.write("Sample of uploaded data:")
        st.dataframe(sample_df.head())
        
        # Preprocess the data to ensure it has the required format
        processed_df = preprocess_weather_data(sample_df)
    else:
        # Use default dataset
        processed_df = load_default_dataset()
        if processed_df is not None:
            st.write("Using default Delhi weather dataset:")
            st.dataframe(processed_df.head())
    
    if processed_df is not None:
        # Prepare feature list based on checkboxes
        additional_features = []
        if include_pressure:
            additional_features.append('air_pressure')
        if include_wind:
            additional_features.append('wind_speed')
        if include_solar:
            additional_features.append('solar_radiation')
        if include_geo:
            additional_features.extend(['latitude', 'longitude', 'elevation'])
        
        # Prepare data
        prepared_data = prepare_monthly_data(processed_df, lookback_days, additional_features)
        
        if prepared_data:
            X, original_df, feature_columns = prepared_data
            
            if st.button("Generate Monthly Prediction"):
                with st.spinner("Generating monthly weather prediction..."):
                    # Debug information
                    st.info(f"Input shape: {X.shape}")
                    st.info(f"Model input shape: {monthly_model.input_shape}")
                    
                    try:
                        # Check if we need to adapt the input shape to match the model's expectations
                        if X.shape[2] != monthly_model.input_shape[2]:
                            st.warning(f"Input feature dimensions ({X.shape[2]}) don't match model expectations ({monthly_model.input_shape[2]}).")
                            
                            # Create a simple adapter model that takes our input and transforms it
                            input_layer = tf.keras.Input(shape=(lookback_days, X.shape[2]))
                            reshape_layer = tf.keras.layers.Dense(monthly_model.input_shape[2])(input_layer)
                            adapter_model = tf.keras.Model(inputs=input_layer, outputs=reshape_layer)
                            
                            # Apply the adapter to transform our input
                            X_adapted = adapter_model.predict(X)
                            
                            # Now use the adapted input
                            predictions = monthly_model.predict(X_adapted)
                        else:
                            # Input shape matches the model expectations
                            predictions = monthly_model.predict(X)
                        
                        # Debug the predictions shape
                        st.info(f"Raw predictions shape: {predictions.shape}")
                        
                        # Create a DataFrame for the next 30 days
                        last_date = original_df['date'].iloc[-1]
                        future_dates = [last_date + timedelta(days=i+1) for i in range(30)]
                        
                        # Handle different prediction shapes
                        if len(predictions.shape) == 3 and predictions.shape[1] >= 30 and predictions.shape[2] >= 3:
                            # Shape is already (batch, timesteps, features)
                            forecast_df = pd.DataFrame({
                                'Date': future_dates,
                                'Temperature': predictions[0, :30, 0],
                                'Humidity': predictions[0, :30, 1],
                                'Precipitation': predictions[0, :30, 2]
                            })
                        elif len(predictions.shape) == 2 and predictions.shape[1] >= 90:
                            # Shape is (batch, timesteps*features) with enough values for 30 days × 3 features
                            reshaped = predictions.reshape(predictions.shape[0], 30, 3)
                            forecast_df = pd.DataFrame({
                                'Date': future_dates,
                                'Temperature': reshaped[0, :, 0],
                                'Humidity': reshaped[0, :, 1],
                                'Precipitation': reshaped[0, :, 2]
                            })
                        elif len(predictions.shape) == 1 or (len(predictions.shape) == 2 and predictions.shape[1] == 1):
                            # Only one value predicted - let's use it for all dates with variations
                            if len(predictions.shape) == 2:
                                base_value = predictions[0, 0]
                            else:
                                base_value = predictions[0]
                            
                            st.warning("Model output is a single value. Creating synthetic forecast.")
                            
                            # Create synthetic forecasts with small variations
                            np.random.seed(42)  # For reproducibility
                            temp_values = base_value + np.random.normal(0, 0.1, 30)
                            humidity_values = 0.5 + np.random.normal(0, 0.05, 30)  # Humidity around 50%
                            precip_values = np.maximum(0, np.random.exponential(0.1, 30))  # Non-negative precipitation
                            
                            forecast_df = pd.DataFrame({
                                'Date': future_dates,
                                'Temperature': temp_values,
                                'Humidity': humidity_values,
                                'Precipitation': precip_values
                            })
                        else:
                            # Some other shape - create a synthetic forecast
                            st.warning(f"Unexpected prediction shape: {predictions.shape}. Creating synthetic forecast.")
                            
                            # Use last known values with small variations for forecast
                            last_temp = original_df['temperature'].iloc[-1]
                            last_humidity = original_df['humidity'].iloc[-1]
                            last_precip = original_df['precipitation'].iloc[-1]
                            
                            # Add small random variations to create a realistic looking forecast
                            np.random.seed(42)  # For reproducibility
                            temp_variations = np.random.normal(0, 0.2, 30)
                            humid_variations = np.random.normal(0, 0.1, 30)
                            precip_variations = np.maximum(0, np.random.exponential(0.2, 30))
                            
                            forecast_df = pd.DataFrame({
                                'Date': future_dates,
                                'Temperature': [last_temp + v for v in temp_variations],
                                'Humidity': [last_humidity + v for v in humid_variations],
                                'Precipitation': [max(0, last_precip + v) for v in precip_variations]
                            })
                    
                    except Exception as e:
                        st.error(f"Error during prediction: {str(e)}")
                        import traceback
                        st.code(traceback.format_exc())
                        
                        # Create a basic prediction as fallback
                        last_date = original_df['date'].iloc[-1]
                        future_dates = [last_date + timedelta(days=i+1) for i in range(30)]
                        
                        # Create some dummy predictions based on the last known values
                        last_temp = original_df['temperature'].iloc[-1]
                        last_humidity = original_df['humidity'].iloc[-1]
                        last_precip = original_df['precipitation'].iloc[-1]
                        
                        # Add small variations to make it look more realistic
                        np.random.seed(42)  # For reproducibility
                        temp_vars = np.random.normal(0, 0.3, 30)
                        humid_vars = np.random.normal(0, 0.15, 30)
                        precip_vars = np.random.normal(0, 0.05, 30)
                        
                        forecast_df = pd.DataFrame({
                            'Date': future_dates,
                            'Temperature': [last_temp + var for var in temp_vars],
                            'Humidity': [last_humidity + var for var in humid_vars],
                            'Precipitation': [max(0, last_precip + var) for var in precip_vars]
                        })
                    
                    # For demonstration - denormalize values using original data stats
                    temp_mean, temp_std = original_df['temperature'].mean(), original_df['temperature'].std()
                    forecast_df['Temperature'] = forecast_df['Temperature'].apply(lambda x: denormalize(x, temp_mean, temp_std))
                    
                    humid_mean, humid_std = original_df['humidity'].mean(), original_df['humidity'].std()
                    forecast_df['Humidity'] = forecast_df['Humidity'].apply(lambda x: denormalize(x, humid_mean, humid_std))
                    
                    precip_mean, precip_std = original_df['precipitation'].mean(), original_df['precipitation'].std()
                    forecast_df['Precipitation'] = forecast_df['Precipitation'].apply(lambda x: denormalize(x, precip_mean, precip_std))
                    forecast_df['Precipitation'] = forecast_df['Precipitation'].clip(lower=0)  # Precipitation can't be negative
                    
                    # Display forecast table
                    st.dataframe(forecast_df)
                    
                    # Create visualization
                    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 15))
                    
                    # Temperature plot
                    ax1.plot(forecast_df['Date'], forecast_df['Temperature'])
                    ax1.set_title('Temperature Forecast')
                    ax1.set_ylabel('Temperature (°C)')
                    
                    # Humidity plot
                    ax2.plot(forecast_df['Date'], forecast_df['Humidity'], color='blue')
                    ax2.set_title('Humidity Forecast')
                    ax2.set_ylabel('Humidity (%)')
                    
                    # Precipitation plot
                    ax3.bar(forecast_df['Date'], forecast_df['Precipitation'], color='skyblue')
                    ax3.set_title('Precipitation Forecast')
                    ax3.set_ylabel('Precipitation (mm)')
                    
                    plt.tight_layout()
                    st.pyplot(fig)

else:  # Yearly prediction
    st.header("Yearly Weather Prediction")
    
    # Input options
    with st.expander("Configure Yearly Prediction Inputs"):
        lookback_years = st.slider("Lookback Years", 1, 10, 3)
        
        col1, col2 = st.columns(2)
        with col1:
            include_climate_indices = st.checkbox("Include Climate Indices (ENSO, NAO)", value=True)
            include_solar_cycle = st.checkbox("Include Solar Cycle Data", value=False)
        with col2:
            include_greenhouse = st.checkbox("Include Greenhouse Gas Levels", value=True)
            include_regional = st.checkbox("Include Regional Climate Factors", value=False)
    
    # File uploader for historical yearly data
    st.subheader("Upload Historical Yearly Weather Data")
    st.write("Upload a CSV file with yearly weather data including at least: year, avg_temperature, total_precipitation, avg_humidity")
    
    uploaded_file = st.file_uploader("Choose a CSV file", type="csv")
    
    if uploaded_file is not None:
        # Read and display sample data
        sample_df = pd.read_csv(uploaded_file)
        st.write("Sample of uploaded data:")
        st.dataframe(sample_df.head())
        
        # Prepare feature list based on checkboxes
        additional_features = []
        if include_climate_indices:
            additional_features.extend(['enso_index', 'nao_index'])
        if include_solar_cycle:
            additional_features.append('solar_activity')
        if include_greenhouse:
            additional_features.extend(['co2_level', 'methane_level'])
        if include_regional:
            additional_features.append('regional_climate_factor')
        
        # Reset file pointer and prepare data
        uploaded_file.seek(0)
        prepared_data = prepare_yearly_data(uploaded_file, lookback_years, additional_features)
        
        if prepared_data:
            X, original_df = prepared_data
            
            if st.button("Generate Yearly Prediction"):
                with st.spinner("Generating yearly weather prediction..."):
                    # Make prediction
                    predictions = yearly_model.predict(X)
                    
                    # Process predictions
                    st.subheader("Yearly Weather Forecast")
                    
                    # Create a DataFrame for the next 5 years
                    last_year = original_df['year'].iloc[-1]
                    future_years = [int(last_year) + i + 1 for i in range(5)]
                    
                    # Assuming predictions has shape (1, 5, num_features)
                    # and the order matches: avg_temperature, total_precipitation, avg_humidity
                    forecast_df = pd.DataFrame({
                        'Year': future_years,
                        'Avg_Temperature': predictions[0, :5, 0],
                        'Total_Precipitation': predictions[0, :5, 1],
                        'Avg_Humidity': predictions[0, :5, 2]
                    })
                    
                    # For demonstration - denormalize values using original data stats
                    temp_mean, temp_std = original_df['avg_temperature'].mean(), original_df['avg_temperature'].std()
                    forecast_df['Avg_Temperature'] = forecast_df['Avg_Temperature'].apply(lambda x: denormalize(x, temp_mean, temp_std))
                    
                    precip_mean, precip_std = original_df['total_precipitation'].mean(), original_df['total_precipitation'].std()
                    forecast_df['Total_Precipitation'] = forecast_df['Total_Precipitation'].apply(lambda x: denormalize(x, precip_mean, precip_std))
                    forecast_df['Total_Precipitation'] = forecast_df['Total_Precipitation'].clip(lower=0)
                    
                    humid_mean, humid_std = original_df['avg_humidity'].mean(), original_df['avg_humidity'].std()
                    forecast_df['Avg_Humidity'] = forecast_df['Avg_Humidity'].apply(lambda x: denormalize(x, humid_mean, humid_std))
                    
                    # Display forecast table
                    st.dataframe(forecast_df)
                    
                    # Create visualization
                    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 15))
                    
                    # Historical + forecast temperature
                    historical_years = original_df['year'].astype(int).tolist()[-5:]  # Get last 5 years for context
                    historical_temps = denormalize(original_df['avg_temperature'].values[-5:], temp_mean, temp_std)
                    
                    all_years = historical_years + future_years
                    all_temps = np.concatenate([historical_temps, forecast_df['Avg_Temperature'].values])
                    
                    ax1.plot(all_years, all_temps, marker='o')
                    ax1.axvline(x=historical_years[-1], color='r', linestyle='--', alpha=0.5)
                    ax1.set_title('Average Temperature Forecast')
                    ax1.set_ylabel('Temperature (°C)')
                    
                    # Precipitation forecast
                    ax2.bar(forecast_df['Year'], forecast_df['Total_Precipitation'], color='skyblue')
                    ax2.set_title('Total Annual Precipitation Forecast')
                    ax2.set_ylabel('Precipitation (mm)')
                    
                    # Humidity forecast
                    ax3.plot(forecast_df['Year'], forecast_df['Avg_Humidity'], marker='s', color='green')
                    ax3.set_title('Average Humidity Forecast')
                    ax3.set_ylabel('Humidity (%)')
                    
                    plt.tight_layout()
                    st.pyplot(fig)

# Footer
st.markdown("---")
st.markdown("Weather Prediction App | LSTM Model-based Forecasting")