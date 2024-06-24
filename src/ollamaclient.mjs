import fetch from "node-fetch"

const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL || "http://localhost:11434/generate"

export async function generateCode(prompt) {
  const response = await fetch(OLLAMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate code from Ollama")
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }

  return data.code
}
