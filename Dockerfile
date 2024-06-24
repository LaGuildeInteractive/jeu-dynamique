# Utiliser une image de base officielle de Node.js
FROM node:16

# Définir le répertoire de travail à /app
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port que l'application utilisera
EXPOSE 8080

# Commande pour lancer l'application
CMD ["node", "game.mjs"]
