import inquirer from "inquirer"
import { saveUser, loadUser } from "./userManager.mjs"
import { gameLoop } from "./gameLoop.mjs"

async function authenticateUser() {
  let username, password
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

  return { username, password }
}

async function initGame() {
  console.log("Bienvenue dans le jeu interactif!")

  try {
    const { username, password } = await authenticateUser()
    await gameLoop(username, password)
  } catch (error) {
    console.error("Erreur lors de la gestion de l'utilisateur:", error)
  }
}

initGame().catch(console.error)
