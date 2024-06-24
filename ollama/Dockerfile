FROM ubuntu:20.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y wget curl git python3 python3-pip

# Install Hugging Face CLI to download models
RUN pip3 install huggingface-hub

# Download and install Ollama
RUN wget -O - https://ollama.com/install.sh | bash

# Create directories for models and the project
RUN mkdir -p /models /app/src

# Copy project files from the parent directory into the container
COPY ./src /app/src

# Download the DeepSeek-Coder-V2-Lite-Instruct-GGUF model
RUN huggingface-cli download bartowski/DeepSeek-Coder-V2-Lite-Instruct-GGUF --include "DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf" --local-dir /models

# Set the working directory
WORKDIR /app

# Expose the port for Ollama
EXPOSE 11434

# Script to start Ollama with the context from project files
COPY ollama/start-ollama.sh /start-ollama.sh
RUN chmod +x /start-ollama.sh

# Command to run the custom start script
CMD ["/start-ollama.sh"]
