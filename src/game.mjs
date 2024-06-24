import inquirer from "inquirer"
import { saveUser, loadUser } from "./userManager.mjs"
import {
  addAchievement,
  getAchievement,
  displayAchievements,
  unsubscribeFromAchievements,
  subscribeToAchievements,
} from "./achievementManager.mjs"
import { generateCode } from "./ollamaClient.mjs"

async function initGame() {
  console.log("Bienvenue dans le jeu interactif!")

  let user = null
  let password = null

  // Demander le nom d'utilisateur et le mot de passe
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Entrez votre nom d'utilisateur:",
    },
    {
      type: "password",
      name: "password",
      message: "Entrez votre mot de passe:",
      mask: "*",
    },
  ])

  const { username, password: pwd } = answers
  password = pwd

  // Charger l'utilisateur depuis IPFS
  try {
    user = await loadUser(username, password)
    if (!user) {
      user = { username }
      await saveUser(user, password)
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de l'utilisateur:", error)
    return
  }

  console.log(`Bienvenue, ${user.username}!`)

  await displayAchievements()

  const achievementHandler = async (msg) => {
    try {
      const jsonString = Buffer.from(msg.data).toString("utf-8")
      console.log("Message brut reçu:", jsonString)

      const data = JSON.parse(jsonString)
      console.log("Nouvelle réalisation reçue via PubSub:", data.achievement)
    } catch (error) {
      console.error("Erreur lors de la réception du message PubSub:", error)
    }
  }

  await subscribeToAchievements(achievementHandler)

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "input",
        name: "action",
        message: 'Que voulez-vous faire ? (entrer "exit" pour quitter)',
      },
    ])

    if (action.toLowerCase() === "exit") {
      console.log("Merci d'avoir joué!")
      break
    }

    if (!action.trim()) {
      console.log("Action invalide. Veuillez entrer une action valide.")
      continue
    }

    try {
      const codePrompt = `The user has the following data: ${JSON.stringify(
        user
      )}. The user requested: "${action}". Generate JavaScript code to handle this request. If the request is too complex or cannot be handled, respond with an appropriate error message.`
      const generatedCode = await generateCode(codePrompt)

      console.log("Code généré par Ollama:", generatedCode)

      // Evaluer le code généré (attention à la sécurité !)
      eval(generatedCode)
    } catch (error) {
      console.error(
        "Erreur lors de la génération ou de l'exécution du code:",
        error
      )
    }

    const achievement = {
      player: user.username,
      action,
      timestamp: new Date().toISOString(),
    }

    try {
      const cid = await addAchievement(achievement)
      console.log(`Action enregistrée avec CID: ${cid}`)

      const retrievedAchievement = await getAchievement(cid)
      console.log("Réalisation récupérée:", retrievedAchievement)
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement ou de la récupération de l'action:",
        error
      )
    }
  }

  // Nettoyer les abonnements
  try {
    await unsubscribeFromAchievements(achievementHandler)
    console.log("Abonnement PubSub fermé.")
  } catch (error) {
    console.error("Erreur lors de la fermeture de l'abonnement PubSub:", error)
  }
}

// Démarrer le jeu
initGame().catch(console.error)
