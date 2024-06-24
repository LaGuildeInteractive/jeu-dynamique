import { create } from "ipfs-http-client"

// Configuration IPFS
const ipfs = create({ host: "localhost", port: "5001", protocol: "http" })

export default ipfs
