# Jeu Dynamique

Bienvenue dans le dépôt principal de **LaGuildeInteractive** pour le projet **Jeu Dynamique**. Ce projet vise à créer un jeu interactif et collaboratif où les scénarios et les scripts sont générés dynamiquement par des IA, permettant aux utilisateurs de jouer ensemble en temps réel via une interface de terminal.

## Objectifs du Projet

1. **Génération Dynamique de Scénarios :** Utiliser des datasets pour créer des scénarios et des scripts dynamiques.
2. **Interface de Terminal :** Permettre aux utilisateurs d'interagir avec le jeu via une interface en ligne de commande.
3. **Reconnaissance Vocale :** Intégrer des commandes vocales pour une interaction plus naturelle.
4. **Intégration Multimédia :** Enrichir l'expérience utilisateur avec des vidéos, des animations et des fichiers audio.
5. **Jeu Collaboratif :** Permettre à plusieurs utilisateurs de se connecter et de jouer ensemble en temps réel.

## Structure du Projet

- **scenario-dataset :** Datasets de scénarios et scripts de base.
- **script-generation :** Scripts et algorithmes pour la génération dynamique de scénarios.
- **terminal-interface :** Interface en ligne de commande.
- **voix-reconnaissance :** Intégration de la reconnaissance vocale.
- **multimedia-integration :** Éléments multimédia pour le jeu.
- **jeu-dynamique :** Fonctionnalités principales du jeu collaboratif.

## Configuration et Installation

1. **Cloner le Dépôt :**

   ```bash
   git clone git@github.com:LaGuildeInteractive/jeu-dynamique.git
   cd jeu-dynamique
   ```

2. **Build docker image**

   ```bash
   docker build -t jeu-dynamique .
   ```

3. **Lancer le Jeu :**

   ```bash
   docker run -d --name jeu-dynamique -p 5001:5001 -p 8080:8080 -p 4001:4001 -v ipfs-data:/root/.ipfs jeu-dynamique
   docker attach jeu-dynamique
   ```

## Contribution

Nous accueillons les contributions ! Merci de suivre ces étapes pour contribuer :

1. Forker le dépôt.
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commiter vos modifications (`git commit -am 'Ajout de ma fonctionnalité'`).
4. Pousser votre branche (`git push origin feature/ma-fonctionnalite`).
5. Créer une Pull Request.

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou suggestion, veuillez contacter [Daniel Febrero Martin](mailto:febrero.daniel@gmail.com).

---

Merci de votre intérêt pour le projet **Jeu Dynamique** de **LaGuildeInteractive** !
