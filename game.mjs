import { create } from "ipfs-http-client"
import inquirer from "inquirer"

// Configuration IPFS
const ipfs = create({ host: "localhost", port: "5001", protocol: "http" })

// Fonction pour ajouter des réalisations à IPFS
async function addAchievement(achievement) {
  const { cid } = await ipfs.add(JSON.stringify(achievement))
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

// Fonction pour initialiser le jeu
async function initGame() {
  console.log("Bienvenue dans le jeu interactif!")

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

    const cid = await addAchievement(achievement)
    console.log(`Action enregistrée avec CID: ${cid}`)

    // Lire les réalisations en temps réel (à titre d'exemple)
    const retrievedAchievement = await getAchievement(cid)
    console.log("Réalisation récupérée:", retrievedAchievement)
  }
}

// Démarrer le jeu
initGame().catch(console.error)
