# Use Python 3.13 slim image as base
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    UV_CACHE_DIR=/tmp/uv-cache

# Set work directory
WORKDIR /app

# Install system dependencies required for the packages
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv (fast Python package installer)
RUN pip install uv

# Copy uv lock file and project configuration
COPY uv.lock pyproject.toml ./

# Install Python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy application code
COPY . .

# Create a non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Expose the port the app runs on
EXPOSE 8000

# Use uv to run the FastAPI app with Uvicorn
CMD ["uv", "run", "uvicorn", "wsgi:app", "--host", "0.0.0.0", "--port", "8000"]
