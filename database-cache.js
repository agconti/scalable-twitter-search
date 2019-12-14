import Redis from 'ioredis'
const databaseCache = new Redis("redis://database_cache:6379/0")

export const get = async (tweetIds) => {
    const pipeline = databaseCache.pipeline()

    tweetIds.forEach(pipeline.get)
    const response = await pipeline.exec()
    const results = response.map(([err, result]) => result)
    const idsNotInCache = results.filter(result => result === null)
    const tweets = results.filter(Boolean)

    return {
        tweets, 
        idsNotInCache,
    }
}

export const set = async (tweet) => {
    const { tweetId } = tweet

    return databaseCache.set(tweetId, JSON.stringify(tweet))
}

