import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Reshape
import os

# Define MSE function
def mse(y_true, y_pred):
    return tf.reduce_mean(tf.square(y_pred - y_true))

def preprocess_data(df):
    """Convert the weather data to the format we need"""
    processed_df = pd.DataFrame()
    
    # Convert datetime
    if 'datetime_utc' in df.columns:
        processed_df['date'] = pd.to_datetime(df['datetime_utc'], format='%Y%m%d-%H:%M', errors='coerce')
    else:
        processed_df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
    
    # Map features
    feature_mapping = {
        '_tempm': 'temperature',
        '_hum': 'humidity', 
        '_precipm': 'precipitation',
        '_pressurem': 'air_pressure',
        '_wspdm': 'wind_speed'
    }
    
    for src, dst in feature_mapping.items():
        if src in df.columns:
            processed_df[dst] = df[src].replace('-9999', np.nan).astype(float)
        else:
            # Default values if column doesn't exist
            if dst == 'temperature':
                processed_df[dst] = 25.0
            elif dst == 'humidity':
                processed_df[dst] = 50.0
            elif dst == 'precipitation':
                processed_df[dst] = 0.0
            elif dst == 'air_pressure':
                processed_df[dst] = 1013.0
            elif dst == 'wind_speed':
                processed_df[dst] = 5.0
    
    # Fill missing values
    processed_df = processed_df.fillna(method='ffill').fillna(method='bfill')
    
    return processed_df

def create_compatible_model(feature_count=8):
    """Create a model with the right input/output dimensions"""
    model = Sequential()
    
    # Input: (batch_size, timesteps, features)
    model.add(LSTM(50, return_sequences=True, input_shape=(30, feature_count)))
    model.add(Dropout(0.2))
    model.add(LSTM(50))
    model.add(Dropout(0.2))
    
    # Output for 3 features (temp, humidity, precip) over 30 days
    # We need exactly 90 values (30 days × 3 features)
    model.add(Dense(90))
    model.add(Reshape((30, 3)))
    
    # Compile
    model.compile(optimizer='adam', loss=mse, metrics=['mse'])
    
    # Test the model with sample data to ensure output has correct shape
    test_input = np.random.random((1, 30, feature_count))
    test_output = model.predict(test_input)
    print(f"Model test output shape: {test_output.shape}")
    if test_output.shape != (1, 30, 3):
        print("WARNING: Model output shape is not (1, 30, 3)")
    
    return model

if __name__ == "__main__":
    # Load and prepare sample data
    data_path = '/Users/taf/Projects/SolarHelper/weather analysis/delhiWeatherHistory.csv'
    df = pd.read_csv(data_path)
    processed_df = preprocess_data(df)
    
    print("Sample processed data:")
    print(processed_df.head())
    
    # Create features
    processed_df['day_of_week'] = processed_df['date'].dt.dayofweek
    processed_df['day_of_month'] = processed_df['date'].dt.day
    processed_df['month'] = processed_df['date'].dt.month
    
    # Count features (all numeric columns except date)
    feature_columns = [col for col in processed_df.columns if col != 'date']
    feature_count = len(feature_columns)
    
    print(f"Feature count: {feature_count}")
    print(f"Features: {feature_columns}")
    
    # Create a compatible model
    model = create_compatible_model(feature_count)
    model.summary()
    
    # Create directories if needed
    os.makedirs('/Users/taf/Projects/SolarHelper/weather analysis/models', exist_ok=True)
    
    # Save the model
    model_path = '/Users/taf/Projects/SolarHelper/weather analysis/models/monthly_lstm_model.h5'
    model.save(model_path)
    print(f"Saved compatible model to {model_path}")
    
    # Also create a yearly model with same architecture but different input shape
    yearly_model = Sequential()
    yearly_model.add(LSTM(50, return_sequences=True, input_shape=(5, 5)))  # 5 years lookback, 5 features
    yearly_model.add(Dropout(0.2))
    yearly_model.add(LSTM(50))
    yearly_model.add(Dropout(0.2))
    yearly_model.add(Dense(5 * 3))  # 5 years forecast, 3 features
    yearly_model.add(Reshape((5, 3)))
    yearly_model.compile(optimizer='adam', loss=mse, metrics=['mse'])
    
    # Save yearly model
    yearly_model_path = '/Users/taf/Projects/SolarHelper/weather analysis/models/yearly_lstm_model.h5'
    yearly_model.save(yearly_model_path)
    print(f"Saved compatible yearly model to {yearly_model_path}")
    
    # After creating the model, run a sanity check
    print("\nRunning sanity check on the model...")
    test_input = np.random.random((1, 30, feature_count))
    test_output = model.predict(test_input)
    print(f"Input shape: {test_input.shape}")
    print(f"Output shape: {test_output.shape}")
    print(f"Expected output shape: (1, 30, 3)")
    
    if test_output.shape != (1, 30, 3):
        print("WARNING: Output shape doesn't match expectation!")
        # Fix the model
        print("Creating a fixed model...")
        model = Sequential()
        model.add(LSTM(50, return_sequences=True, input_shape=(30, feature_count)))
        model.add(Dropout(0.2))
        model.add(LSTM(50))
        model.add(Dropout(0.2))
        model.add(Dense(90))  # Exactly 90 outputs needed (30 days × 3 features)
        model.add(Reshape((30, 3)))  # Explicitly reshape to (30, 3)
        model.compile(optimizer='adam', loss=mse, metrics=['mse'])
        
        # Verify fixed model
        test_output_fixed = model.predict(test_input)
        print(f"Fixed model output shape: {test_output_fixed.shape}")
        
        # Save the fixed model
        model.save(model_path)
        print(f"Saved fixed model to {model_path}")
    
    # Also check yearly model
    test_yearly_input = np.random.random((1, 5, 5))
    test_yearly_output = yearly_model.predict(test_yearly_input)
    print(f"Yearly model test input shape: {test_yearly_input.shape}")
    print(f"Yearly model test output shape: {test_yearly_output.shape}")
    print(f"Expected output shape: (1, 5, 3)")
    
    if test_yearly_output.shape != (1, 5, 3):
        print("WARNING: Yearly model output shape doesn't match expectation!")
        # Fix the yearly model
        yearly_model = Sequential()
        yearly_model.add(LSTM(50, return_sequences=True, input_shape=(5, 5))) 
        yearly_model.add(Dropout(0.2))
        yearly_model.add(LSTM(50))
        yearly_model.add(Dropout(0.2))
        yearly_model.add(Dense(15))  # Exactly 15 outputs needed (5 years × 3 features)
        yearly_model.add(Reshape((5, 3)))  # Explicitly reshape to (5, 3)
        yearly_model.compile(optimizer='adam', loss=mse, metrics=['mse'])
        
        # Verify fixed model
        test_output_fixed = yearly_model.predict(test_yearly_input)
        print(f"Fixed yearly model output shape: {test_output_fixed.shape}")
        
        # Save the fixed yearly model
        yearly_model.save(yearly_model_path)
        print(f"Saved fixed yearly model to {yearly_model_path}")
