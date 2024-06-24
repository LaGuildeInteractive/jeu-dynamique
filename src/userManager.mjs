import ipfs from "./ipfsClient.mjs"
import crypto from "crypto"

function generateUserFilePath(username, password) {
  const hash = crypto
    .createHash("sha256")
    .update(username + password)
    .digest("hex")
  return `/user_files/${hash}.json`
}

export async function saveUser(username, password) {
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex")
  const userInfo = { username, password: hashedPassword }

  const filePath = generateUserFilePath(username, password)
  const buffer = Buffer.from(JSON.stringify(userInfo))
  await ipfs.files.write(filePath, buffer, { create: true, parents: true })

  return filePath
}

export async function loadUser(username, password) {
  const filePath = generateUserFilePath(username, password)
  try {
    const chunks = []
    for await (const chunk of ipfs.files.read(filePath)) {
      chunks.push(chunk)
    }
    const userInfo = JSON.parse(Buffer.concat(chunks).toString())
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")

    if (userInfo.password === hashedPassword) {
      return userInfo
    } else {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect")
    }
  } catch (error) {
    if (error.message.includes("file does not exist")) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect")
    } else {
      throw error
    }
  }
}
