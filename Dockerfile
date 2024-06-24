# Utiliser l'image IPFS v0.11.0
FROM ipfs/go-ipfs:latest

# Exposer les ports nécessaires
EXPOSE 4001 5001 8080

# Démarrer le daemon IPFS avec PubSub activé
CMD ["daemon", "--enable-pubsub-experiment"]
