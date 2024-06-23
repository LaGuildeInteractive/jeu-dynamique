# Utiliser une image de base Node.js officielle
FROM node:18

# Installer IPFS
RUN npm install -g ipfs

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Exposer les ports nécessaires pour IPFS et l'application (ajustez en fonction de vos besoins)
EXPOSE 5001 8080 4001

# Script d'entrée pour démarrer IPFS et l'application Node.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Commande d'entrée pour le conteneur
CMD ["/entrypoint.sh"]
