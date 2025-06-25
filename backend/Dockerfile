# Use Python 3.13 slim image as base
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies required for the packages
# `build-essential` is needed for packages with C extensions (like many Python packages)
# `curl` is needed for your healthcheck
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
# We copy requirements.txt separately to leverage Docker caching.
# If only code changes, this layer won't rebuild.
COPY requirements.txt ./

# Install Python dependencies using pip
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user and set ownership for /app
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app

# Copy application code
# This should be done AFTER installing dependencies and creating the user,
# to ensure the 'app' user owns the copied code.
COPY . .

# Switch to the non-root user
USER app

# Expose the port the app runs on
EXPOSE 8000

# Use uvicorn directly to run the FastAPI app
CMD ["uvicorn", "wsgi:app", "--host", "0.0.0.0", "--port", "8000"]