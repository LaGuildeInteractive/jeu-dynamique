import inquirer from "inquirer"
import { saveUser, loadUser } from "./userManager.mjs"
import { generateCode } from "./ollamaclient.mjs"
import ipfs from "./ipfsClient.mjs"

async function executeGeneratedCode(code) {
  try {
    const func = new Function("require", "ipfs", "saveUser", "loadUser", code)
    await func(require, ipfs, saveUser, loadUser)
  } catch (error) {
    console.error("Erreur lors de l'exécution du code généré:", error)
  }
}

async function initGame() {
  console.log("Bienvenue dans le jeu interactif!")

  let username
  let password

  try {
    let userAuthenticated = false
    while (!userAuthenticated) {
      const credentials = await inquirer.prompt([
        {
          type: "input",
          name: "username",
          message: "Entrez votre nom d'utilisateur:",
        },
        {
          type: "password",
          name: "password",
          message: "Entrez votre mot de passe:",
        },
      ])

      username = credentials.username
      password = credentials.password

      try {
        const userInfo = await loadUser(username, password)
        console.log(`Bienvenue, ${userInfo.username}!`)
        userAuthenticated = true
      } catch (error) {
        console.error("Nom d'utilisateur ou mot de passe incorrect.")
        const createUser = await inquirer.prompt([
          {
            type: "confirm",
            name: "create",
            message: "Voulez-vous créer un nouveau compte ?",
          },
        ])
        if (createUser.create) {
          await saveUser(username, password)
          console.log(`Utilisateur ${username} créé!`)
          userAuthenticated = true
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de l'utilisateur:", error)
  }

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

    try {
      const prompt = `Action de l'utilisateur: ${answers.action}`
      const generatedCode = await generateCode(prompt)
      console.log(`Code généré par Ollama: ${generatedCode}`)
      await executeGeneratedCode(generatedCode)
    } catch (error) {
      console.error(
        "Erreur lors de l'appel à Ollama ou de l'exécution du code généré:",
        error
      )
    }
  }
}

initGame().catch(console.error)
