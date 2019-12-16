import CRC32 from 'crc-32'
import Redis from 'ioredis'
import { addToIndexBuilderServer } from './index-builder.js'
const { INDEX_SERVER_SHARD_1, INDEX_SERVER_SHARD_2, INDEX_SERVER_SHARD_3, INDEX_SERVER_SHARD_4 } = process.env
const indexServers = [
  new Redis(INDEX_SERVER_SHARD_1),
  new Redis(INDEX_SERVER_SHARD_2),
  new Redis(INDEX_SERVER_SHARD_3),
  new Redis(INDEX_SERVER_SHARD_4)
]

const normalizeContent = content => {
  return content.toLowerCase().replace(/[^A-Za-z0-9\s]/g, '').replace(/\s{2,}/g, ' ').split(' ')
}

const wordToIndexServer = word => {
  const indexServerId = Math.abs(CRC32.str(word)) % indexServers.length
  const indexServer = indexServers[indexServerId]

  return { indexServerId, indexServer, word }
}

export const getTweetIdsFromIndex = async query => {
  const words = normalizeContent(query)
  const serverWordPairs = words.map(wordToIndexServer)

  const cacheRequests = serverWordPairs.map(({ indexServer, word }) => indexServer.smembers(word))
  const tweetIds = await Promise.all(cacheRequests).then(items => items.flat())
  return tweetIds
}

export const indexTweet = async ({ tweetId, content }) => {
  const words = normalizeContent(content)
  const serverWordPairs = words.map(wordToIndexServer)

  const requestsToIndexServers = serverWordPairs.map(({ indexServer, word }) => {
    return indexServer.sadd(word, tweetId)
  })
  const requestsToIndexBuilder = serverWordPairs.map(({ indexServerId }) => {
    return addToIndexBuilderServer(indexServerId, tweetId)
  })

  await Promise.all([...requestsToIndexServers, requestsToIndexBuilder])
}
