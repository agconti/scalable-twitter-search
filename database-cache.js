import Redis from 'ioredis'
const databaseCache = new Redis('redis://database_cache:6379/0')

export const get = async (tweetIds) => {
  const pipeline = databaseCache.pipeline()

  tweetIds.forEach(id => pipeline.get(id))
  const response = await pipeline.exec()
  const results = response.map(([_, result]) => result) // eslint-disable line handle-callback-err
  const idsNotInCache = results.map((result, index) => result === null ? tweetIds[index] : null).filter(Boolean)
  const tweets = results.filter(Boolean).map(JSON.parse)

  return {
    tweets,
    idsNotInCache
  }
}

export const set = async (tweet) => {
  const { tweetId } = tweet

  return databaseCache.set(tweetId, JSON.stringify(tweet))
}
