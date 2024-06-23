#!/bin/sh

# Initialiser IPFS si nécessaire
if [ ! -d ~/.ipfs ]; then
  ipfs init
fi

# Activer les fonctionnalités expérimentales d'IPFS
ipfs config --json Experimental.PubsubEnabled true

# Démarrer le daemon IPFS en arrière-plan
ipfs daemon &

# Attendre que le daemon IPFS soit prêt
while ! ipfs swarm peers; do
  echo "Attente du démarrage du daemon IPFS..."
  sleep 1
done

# Démarrer l'application Node.js
node /app/game.mjs
