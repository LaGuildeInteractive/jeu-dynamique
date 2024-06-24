FROM ubuntu:20.04

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y wget curl

# Télécharger et installer Ollama
RUN wget -O - https://ollama.com/install.sh | bash

# Exposer le port pour Ollama
EXPOSE 11434

# Commande pour démarrer Ollama
CMD ["ollama", "serve", "--port", "11434"]
