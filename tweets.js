import * as snowflake from 'nodejs-snowflake'
import * as indexServer from './index-server.js'
import * as db from './db.js'
import * as cache from './database-cache.js'
const uid = new snowflake.default.UniqueID()

export const saveTweet = async content => {
  const tweetId = await uid.asyncGetUniqueID()
  const tweet = { tweetId, content }

  await Promise.all([
    indexServer.indexTweet(tweet),
    db.insert(tweet)
  ])
}

export const getTweetsById = async tweetIds => {
  const { tweets, idsNotInCache } = await cache.get(tweetIds)

  if (!idsNotInCache.length) {
    console.log(`🤖CACHED ITEMS`)
    console.log(`🤖CACHED ITEMS`)
    console.log(`🤖CACHED ITEMS`)

    return tweets
  }

  console.log(`🔥UNCACHED ITEMS 🔥🔥🔥`)
  console.log(`🔥UNCACHED ITEMS 🔥🔥🔥`)
  console.log(`🔥UNCACHED ITEMS 🔥🔥🔥`)

  const tweetsFromDb = await db.getByIds(idsNotInCache)
  tweetsFromDb.map(cache.set)

  console.log(`looking for`, tweetIds, `tweets FROM cache`, tweets, `tweetsFromDb`, tweetsFromDb)
  return [...tweets, ...tweetsFromDb]
}

export const getTweetsByQuery = query => {
  return db.fullTextSearch(query)
}

export const search = async (req, res) => {
  const { query: { query } } = req
  const tweetIds = await indexServer.getTweetIdsFromIndex(query)
  const noIndexedTweetsForQuery = tweetIds.length < 1

  if (noIndexedTweetsForQuery) {
    const tweets = await db.fullTextSearch(query)
    res.json(tweets)
    return
  }

  const tweets = await getTweetsById(tweetIds)
  res.json(tweets)
}

export const create = async (req, res) => {
    const { content } = req.body
    await saveTweet(content)
    return res.sendStatus(201)
}   