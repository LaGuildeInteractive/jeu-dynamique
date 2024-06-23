#!/bin/sh

# Fonction pour nettoyer les processus IPFS en cours
cleanup() {
  echo "Arrêt des processus IPFS en cours..."
  pkill ipfs
  rm -rf ~/.ipfs/repo.lock
}

# Appeler la fonction cleanup lorsque le script se termine
trap cleanup EXIT

# Initialiser IPFS si nécessaire
if [ ! -d ~/.ipfs ]; then
  ipfs init
fi

# Activer les fonctionnalités expérimentales d'IPFS
ipfs config --json Experimental.PubsubEnabled true

# Démarrer le daemon IPFS en arrière-plan
ipfs daemon --enable-pubsub-experiment &

# Attendre que le daemon IPFS soit prêt
until ipfs swarm peers > /dev/null 2>&1; do
  echo "Attente du démarrage du daemon IPFS..."
  sleep 1
done

# Démarrer l'application Node.js
node /app/game.mjs
