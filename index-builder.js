import Redis from 'ioredis'
import { getTweetsById } from './tweets.js'
import { indexTweet } from './index-server.js'
const indexBuilderServer = new Redis(process.env.INDEX_BUILDER)

export const addToIndexBuilderServer = async (indexServerId, tweetId) => {
  return indexBuilderServer.sadd(indexServerId, tweetId)
}

export const rebuildIndexServer = async (serverId) => {
  const tweetIds = await indexBuilderServer.smembers(serverId)
  const tweets = await getTweetsById(tweetIds)

  await Promise.all(tweets.map(indexTweet))
}
