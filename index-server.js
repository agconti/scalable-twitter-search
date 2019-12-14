import { promisify } from 'util'
import CRC32 from 'crc-32'
import Redis from 'ioredis'
import { addToIndexBuilderServer } from './index-builder.js'
const indexServers = [
    new Redis("redis://index_server:6379/0"),
    new Redis("redis://index_server:6379/0"),
    new Redis("redis://index_server:6379/0"),
    new Redis("redis://index_server:6379/0"),
]


const wordToIndexServer = word => {
    const cacheId = Math.abs(CRC32.str(word)) % indexServers.length
    const indexServerForWord = indexServers[cacheId]
    return [indexServerForWord, word]
}

export const getTweetIdsFromIndex = async query => {
    const words = query.split(" ")
    const serverWordPairs = words.map(wordToIndexServer)

    const cacheRequests = serverWordPairs.map(([redis, word]) => {
        const get = redis.smembers
        return get(word)
    })

    const tweetIds = await Promise.all(cacheRequests).then(items => items.flat())
    return tweetIds

}

export const indexTweet = async (tweetId, content) => {
    const words = content.split(" ")
    const serverWordPairs = words.map(wordToIndexServer)
    
    const requestsToIndexServers = serverWordPairs.map(([redis, word]) => redis.sadd(word, tweetId))
    const requestsToIndexBuilder = serverWordPairs.map(([redis, word]) => {
        return addToIndexBuilderServer(wordToIndexServer(word), tweetId)
    })

    await Promise.all([...requestsToIndexServers, requestsToIndexBuilder, ])
}


// this isnt actually the index server doing this. it application teir. the index server in this case is dumb