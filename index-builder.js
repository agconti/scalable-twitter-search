import { promisify } from 'util'
import Redis from 'ioredis'
import { getTweetsById } from './tweets.js'
import { indexTweet } from './index-server.js'
const indexBuilderServer = new Redis("redis://index_builder:6379/0")

export const addToIndexBuilderServer = async (indexServerId, tweetId) => {
    const add = promisify(indexBuilderServer.sadd)
    return add(indexServerId, tweetId)
}


export const rebuildIndexServer = (serverId) => {
    const get = promisify(indexBuilderServer.smembers)
    const tweetIds = get(serverId)
    const tweets = await getTweetsById(tweetIds)
    
    await Promise.all(tweets.map(indexTweet))
}