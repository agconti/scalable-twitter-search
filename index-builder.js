import { promisify } from 'util'
import Redis from 'ioredis'
import { getTweetsById } from './tweet'
import { indexTweet } from './index-server'
const indexBuilderServer = new Redis("redis://:authpassword@index_builder1:6380/0")

export const addToIndexBuilderServer = async (indexServerId, tweetId) => {
    const add = promisify(indexBuilderServer.sadd)
    return add(indexServerId, tweetId)
}


export const rebuildIndexServer = (serverId) => {
    const get = promisify(indexBuilderServer.smembers)
    const tweeIds = get(serverId)
    const tweets = await getTweetsById(tweetIds)
    
    await Promise.all(tweets.map(indexTweet))
}