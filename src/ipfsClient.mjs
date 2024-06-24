import { create } from "ipfs-http-client"

const IPFS_API_URL = process.env.IPFS_API_URL || "http://localhost:5002"

const ipfs = create({ url: IPFS_API_URL })

export default ipfs
