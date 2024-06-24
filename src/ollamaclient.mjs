import axios from "axios"

async function generateCode(prompt) {
  try {
    const response = await axios.post("http://localhost:11434/generate", {
      prompt: prompt,
    })
    return response.data.code
  } catch (error) {
    console.error("Erreur lors de l'appel à Ollama:", error)
    throw error
  }
}

export { generateCode }
