#!/bin/bash

# Function to read file content and format it for context
add_to_context() {
    local file_path=$1
    local context_file=$2
    echo -e "\n\n# Content from $file_path\n$(cat $file_path)" >> $context_file
}

# Path to the context file
context_file="/app/context.txt"

# Initialize the context file
echo "# Model Context" > $context_file

# Add the content of each project file in /app/src to the context
for file in /app/src/*.mjs; do
    add_to_context "$file" $context_file
done

# Start Ollama with the model and context
ollama serve --model-path /models/DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf --context-path $context_file
