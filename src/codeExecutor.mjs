import ipfs from "./ipfsClient.mjs"
import { saveUser, loadUser } from "./userManager.mjs"

async function executeGeneratedCode(code) {
  try {
    const func = new Function("require", "ipfs", "saveUser", "loadUser", code)
    await func(require, ipfs, saveUser, loadUser)
  } catch (error) {
    console.error("Erreur lors de l'exécution du code généré:", error)
  }
}

export { executeGeneratedCode }
