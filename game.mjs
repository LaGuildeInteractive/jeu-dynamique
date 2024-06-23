import { create } from "ipfs-http-client"
import inquirer from "inquirer"

// Configuration IPFS
const ipfs = create({ host: "localhost", port: "5001", protocol: "http" })

// Constantes pour le namespace PubSub
const PUBSUB_TOPIC = "game-achievements"

// Fonction pour ajouter des réalisations à IPFS et publier sur PubSub
async function addAchievement(achievement) {
  const { cid } = await ipfs.add(JSON.stringify(achievement))

  // Publier sur PubSub
  await ipfs.pubsub.publish(
    PUBSUB_TOPIC,
    Buffer.from(JSON.stringify({ cid: cid.toString(), achievement }))
  )

  return cid
}

// Fonction pour récupérer une réalisation depuis IPFS
async function getAchievement(cid) {
  const chunks = []
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk)
  }
  const achievement = JSON.parse(Buffer.concat(chunks).toString())
  return achievement
}

// Fonction pour souscrire aux réalisations via PubSub
async function subscribeToAchievements() {
  await ipfs.pubsub.subscribe(PUBSUB_TOPIC, async (msg) => {
    try {
      // Convertir les octets en chaîne JSON
      const jsonString = Buffer.from(msg.data).toString("utf-8")

      // Log le message brut reçu
      console.log("Message brut reçu:", jsonString)

      const data = JSON.parse(jsonString)
      console.log("Nouvelle réalisation reçue via PubSub:", data.achievement)
    } catch (error) {
      console.error("Erreur lors de la réception du message PubSub:", error)
    }
  })
}

// Fonction pour initialiser le jeu
async function initGame() {
  console.log("Bienvenue dans le jeu interactif!")

  // Souscrire aux réalisations via PubSub
  subscribeToAchievements().catch(console.error)

  while (true) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "action",
        message: 'Que voulez-vous faire ? (entrer "exit" pour quitter)',
      },
    ])

    if (answers.action.toLowerCase() === "exit") {
      console.log("Merci d'avoir joué!")
      break
    }

    const achievement = {
      player: "Player1",
      action: answers.action,
      timestamp: new Date().toISOString(),
    }

    try {
      const cid = await addAchievement(achievement)
      console.log(`Action enregistrée avec CID: ${cid}`)

      // Lire les réalisations en temps réel (à titre d'exemple)
      const retrievedAchievement = await getAchievement(cid)
      console.log("Réalisation récupérée:", retrievedAchievement)
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement ou de la récupération de l'action:",
        error
      )
    }
  }
}

// Démarrer le jeu
initGame().catch(console.error)
