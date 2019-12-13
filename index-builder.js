import { promisify } from 'util'
import Redis from 'ioredis'
const indexBuilderServer = new Redis("redis://:authpassword@index_builder1:6380/0")

export const addToIndexBuilderServer = async (indexServerId, tweetId) => {
    const add = promisify(indexBuilderServer.sadd)
    return add(indexServerId, tweetId)
}
