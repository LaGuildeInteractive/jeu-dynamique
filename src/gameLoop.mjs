import inquirer from "inquirer"
import { generateCode } from "./ollamaclient.mjs"
import { executeGeneratedCode } from "./codeExecutor.mjs"

async function gameLoop(username, password) {
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
      const codePrompt = `The user has the following data: { username: "${username}", password: "${password}" }. The user requested: "${answers.action}". Generate JavaScript code to handle this request. If the request is too complex or cannot be handled, respond with an appropriate error message.`
      const generatedCode = await generateCode(codePrompt)

      console.log("Code généré par Ollama:", generatedCode)

      await executeGeneratedCode(generatedCode)
    } catch (error) {
      console.error(
        "Erreur lors de la génération ou de l'exécution du code:",
        error
      )
    }
  }
}

export { gameLoop }
