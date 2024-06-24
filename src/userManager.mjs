import ipfs from "./ipfsClient.mjs"
import crypto from "crypto"

function generateHash(username, password) {
  return crypto
    .createHash("sha256")
    .update(username + password)
    .digest("hex")
}

export async function saveUser(user, password) {
  try {
    const userHash = generateHash(user.username, password)
    const userPath = `/LaGuildeInteractive/users/${userHash}`
    const { cid } = await ipfs.add(JSON.stringify(user))
    await ipfs.files.write(userPath, new TextEncoder().encode(cid.toString()), {
      create: true,
      parents: true,
    })
    console.log("User information saved:", user)
  } catch (error) {
    console.error("Error saving user information to IPFS:", error)
    throw error
  }
}

export async function loadUser(username, password) {
  try {
    const userHash = generateHash(username, password)
    const userPath = `/LaGuildeInteractive/users/${userHash}`
    const chunks = []
    for await (const chunk of ipfs.files.read(userPath)) {
      chunks.push(chunk)
    }
    const cid = Buffer.concat(chunks).toString()
    const contentChunks = []
    for await (const contentChunk of ipfs.cat(cid)) {
      contentChunks.push(contentChunk)
    }
    return JSON.parse(Buffer.concat(contentChunks).toString())
  } catch (error) {
    if (error.message.includes("file does not exist")) {
      console.log("User file does not exist.")
      return null
    }
    console.error("Error loading user information from IPFS:", error)
    throw error
  }
}
