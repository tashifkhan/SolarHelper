import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import os

# Define MSE loss function
def mse(y_true, y_pred):
    return tf.reduce_mean(tf.square(y_pred - y_true))

def create_monthly_lstm_model(input_shape, output_features=3):
    """
    Create an LSTM model for monthly weather prediction
    
    Args:
        input_shape: Tuple (timesteps, features)
        output_features: Number of weather features to predict
        
    Returns:
        Compiled LSTM model
    """
    model = Sequential()
    
    # LSTM layers
    model.add(LSTM(50, return_sequences=True, input_shape=input_shape))
    model.add(Dropout(0.2))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dropout(0.2))
    
    # Output layer - for multiple day forecasts with multiple features
    model.add(Dense(30 * output_features))  # 30 days forecast with output_features per day
    model.add(tf.keras.layers.Reshape((30, output_features)))  # Reshape to (30, output_features)
    
    # Compile model
    model.compile(optimizer=Adam(learning_rate=0.001), loss=mse, metrics=['mean_squared_error'])
    
    return model

def preprocess_data(df):
    """
    Preprocess weather data for LSTM model
    
    Args:
        df: DataFrame containing weather data with 'date' column
        
    Returns:
        Processed DataFrame
    """
    # Ensure date is datetime
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    
    # Add time features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['day_of_month'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    
    # Normalize numerical features
    feature_columns = [col for col in df.columns if col != 'date']
    for column in feature_columns:
        if np.issubdtype(df[column].dtype, np.number):
            df[column] = (df[column] - df[column].mean()) / df[column].std()
            
    return df

def create_sequences(data, seq_length=30, target_horizon=30, target_cols=None):
    """
    Create input sequences and target values for time series forecasting
    
    Args:
        data: DataFrame of features (without date column)
        seq_length: Length of input sequence (lookback)
        target_horizon: How many steps ahead to predict
        target_cols: List of column indices to predict
        
    Returns:
        X: Input sequences
        y: Target sequences
    """
    X = []
    y = []
    
    if target_cols is None:
        # Default to first 3 columns (e.g., temperature, humidity, precipitation)
        target_cols = [0, 1, 2]
    
    data_array = data.values
    
    for i in range(len(data) - seq_length - target_horizon + 1):
        X.append(data_array[i:i + seq_length])
        
        # Extract target features for the next target_horizon days
        targets = []
        for j in range(target_horizon):
            if i + seq_length + j < len(data):
                # Extract only the target columns for this day
                targets.append([data_array[i + seq_length + j, col] for col in target_cols])
        
        # If we collected predictions for all days in the horizon
        if len(targets) == target_horizon:
            y.append(targets)
    
    return np.array(X), np.array(y)

def train_lstm_model(data_path, model_save_path, feature_cols=None, target_cols=None, 
                     lookback_days=30, forecast_days=30, epochs=50, batch_size=32):
    """
    Train and save an LSTM model for weather forecasting
    
    Args:
        data_path: Path to CSV file with weather data
        model_save_path: Where to save the trained model
        feature_cols: List of column names to use as features
        target_cols: List of column names to predict
        lookback_days: Number of days to use as input
        forecast_days: Number of days to predict
        epochs: Training epochs
        batch_size: Training batch size
    """
    print("Loading data from:", data_path)
    df = pd.read_csv(data_path)
    
    # Preprocess the data if it has the weather history format
    if 'datetime_utc' in df.columns and 'date' not in df.columns:
        print("Converting weather history format to standard format...")
        processed_df = pd.DataFrame()
        
        # Convert datetime
        processed_df['date'] = pd.to_datetime(df['datetime_utc'], format='%Y%m%d-%H:%M', errors='coerce')
        
        # Map the columns
        column_mapping = {
            '_tempm': 'temperature',
            '_hum': 'humidity',
            '_precipm': 'precipitation',
            '_pressurem': 'air_pressure',
            '_wspdm': 'wind_speed'
        }
        
        for src_col, dst_col in column_mapping.items():
            if src_col in df.columns:
                processed_df[dst_col] = df[src_col].replace('-9999', np.nan).astype(float)
        
        # Fill any missing values
        processed_df = processed_df.fillna(method='ffill').fillna(method='bfill')
        
        # Use the processed dataframe
        df = processed_df
    
    # Check if we have the required columns after preprocessing
    if feature_cols:
        missing_cols = [col for col in feature_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing columns in dataset: {missing_cols}. Available columns: {df.columns.tolist()}")
        
        # Select only the required columns
        df = df[['date'] + feature_cols]
    
    # Preprocess data
    processed_df = preprocess_data(df)
    
    # Map target column names to indices if specified
    target_indices = None
    if target_cols:
        feature_names = [col for col in processed_df.columns if col != 'date']
        target_indices = [feature_names.index(col) for col in target_cols if col in feature_names]
    
    # Create sequences
    data_no_date = processed_df.drop('date', axis=1)
    X, y = create_sequences(data_no_date, seq_length=lookback_days, 
                           target_horizon=forecast_days, target_cols=target_indices)
    
    print(f"Input shape (samples, timesteps, features): {X.shape}")
    print(f"Output shape (samples, forecast_days, target_features): {y.shape}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Create model
    model = create_monthly_lstm_model(input_shape=(lookback_days, X.shape[2]), 
                                     output_features=y.shape[2])
    
    # Display model architecture
    model.summary()
    
    # Train model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=epochs,
        batch_size=batch_size,
        verbose=1
    )
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    
    # Save model
    model.save(model_save_path)
    print(f"Model saved to {model_save_path}")
    
    # Plot training history
    plt.figure(figsize=(12, 6))
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Training History')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    # Save plot
    plot_path = os.path.join(os.path.dirname(model_save_path), 'training_history.png')
    plt.savefig(plot_path)
    print(f"Training history plot saved to {plot_path}")
    
    return model

if __name__ == "__main__":
    # Example usage
    data_path = '/Users/taf/Projects/SolarHelper/weather analysis/delhiWeatherHistory.csv'
    model_save_path = '/Users/taf/Projects/SolarHelper/weather analysis/models/monthly_lstm_model.h5'
    
    # Select columns to use - these should match what's in the processed data
    feature_cols = ['temperature', 'humidity', 'precipitation', 'air_pressure', 'wind_speed']
    target_cols = ['temperature', 'humidity', 'precipitation']  # What we want to predict
    
    train_lstm_model(
        data_path=data_path,
        model_save_path=model_save_path,
        feature_cols=feature_cols,
        target_cols=target_cols,
        lookback_days=30,
        forecast_days=30,
        epochs=50,
        batch_size=32
    )
