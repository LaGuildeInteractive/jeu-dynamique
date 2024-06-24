import ipfs from "./ipfsClient.mjs"

const NAMESPACE = "LaGuildeInteractive"
const PUBSUB_TOPIC = `${NAMESPACE}-game-achievements`

export async function addAchievement(achievement) {
  try {
    const { cid } = await ipfs.add(JSON.stringify(achievement))
    console.log("CID obtenu après ajout à IPFS:", cid.toString())

    // Publier sur PubSub
    await ipfs.pubsub.publish(
      PUBSUB_TOPIC,
      Buffer.from(JSON.stringify({ cid: cid.toString(), achievement }))
    )

    return cid
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réalisation à IPFS:", error)
    throw error
  }
}

export async function getAchievement(cid) {
  try {
    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk)
    }
    const achievement = JSON.parse(Buffer.concat(chunks).toString())
    return achievement
  } catch (error) {
    console.error("Erreur lors de la récupération de la réalisation:", error)
    throw error
  }
}

export async function subscribeToAchievements(handler) {
  try {
    await ipfs.pubsub.subscribe(PUBSUB_TOPIC, handler)
  } catch (error) {
    console.error("Erreur lors de la souscription à PubSub:", error)
    throw error
  }
}

export async function unsubscribeFromAchievements(handler) {
  try {
    await ipfs.pubsub.unsubscribe(PUBSUB_TOPIC, handler)
  } catch (error) {
    console.error("Erreur lors de la désinscription de PubSub:", error)
    throw error
  }
}

export async function displayAchievements() {
  try {
    const subscriptions = await ipfs.pubsub.ls()
    if (!subscriptions.includes(PUBSUB_TOPIC)) {
      console.log("Aucune réalisation trouvée.")
      return
    }

    await subscribeToAchievements(async (msg) => {
      try {
        const jsonString = Buffer.from(msg.data).toString("utf-8")
        console.log("Message brut reçu:", jsonString)

        const data = JSON.parse(jsonString)
        console.log("Nouvelle réalisation reçue via PubSub:", data.achievement)
      } catch (error) {
        console.error("Erreur lors de la réception du message PubSub:", error)
      }
    })
  } catch (error) {
    console.error("Erreur lors de l'affichage des réalisations:", error)
  }
}
