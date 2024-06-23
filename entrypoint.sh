#!/bin/sh

# Fonction pour nettoyer les processus IPFS en cours
cleanup() {
  echo "Arrêt des processus IPFS en cours..."
  pkill ipfs
  rm -rf ~/.ipfs/repo.lock
}

# Appeler la fonction cleanup lorsque le script se termine
trap cleanup EXIT

# Supprimer le verrou du dépôt IPFS s'il existe
if [ -f ~/.ipfs/repo.lock ]; then
  rm -f ~/.ipfs/repo.lock
fi

# Vérifier le contenu du répertoire IPFS
echo "Vérification du contenu du répertoire IPFS :"
ls -la ~/.ipfs

# Initialiser IPFS si nécessaire
if [ ! -f ~/.ipfs/config ]; then
  echo "Initialisation du dépôt IPFS..."
  ipfs init
fi

# Vérifier que l'initialisation a réussi
if [ ! -f ~/.ipfs/config ]; then
  echo "Échec de l'initialisation du dépôt IPFS. Abandon."
  exit 1
fi

# Activer les fonctionnalités expérimentales d'IPFS
ipfs config --json Experimental.PubsubEnabled true

# Démarrer le daemon IPFS en arrière-plan et rediriger la sortie
ipfs daemon --enable-pubsub-experiment > /var/log/ipfs_daemon.log 2>&1 &

# Attendre que le daemon IPFS soit prêt
TRIES=0
MAX_TRIES=30

until ipfs swarm peers > /dev/null 2>&1; do
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo "Le daemon IPFS n'a pas démarré après $TRIES tentatives. Voir /var/log/ipfs_daemon.log pour plus d'informations."
    cat /var/log/ipfs_daemon.log
    exit 1
  fi
  echo "Attente du démarrage du daemon IPFS... (Tentative $TRIES/$MAX_TRIES)"
  TRIES=$((TRIES+1))
  sleep 1
done

echo "Daemon IPFS démarré avec succès"

# Démarrer l'application Node.js
node /app/game.mjs
