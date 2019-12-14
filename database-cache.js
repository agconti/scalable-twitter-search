import { promisify } from 'util'
import Redis from 'ioredis'
const databaseCache = new Redis("redis://database_cache:6379/0")

export const get = async (tweetIds) => {
    const pipeline = databaseCache.pipeline()

    tweetIds.forEach(pipeline.get)
    const results = await pipeline.exec()
    const idsNotInCache = results.filter(([err, result]) => result === null)
    const tweets = results.map(([err, result]) => {
        if (result === null) {
            return
        }
        return result
    })

    return {
        tweets, 
        idsNotInCache,
    }
}

export const set = async (tweet) => {
    const { tweetId } = tweet
    const set = promisify(databaseCache.set)

    return set(tweetId, JSON.stringify(tweet))
}

