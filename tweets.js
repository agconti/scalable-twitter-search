import * as snowflake from 'nodejs-snowflake'
import { indexTweet } from './index-server.js'
import { queryDatabase, TWEET_TABLE } from './db.js'
import * as cache from './database-cache.js'
const uid = new snowflake.default.UniqueID()

export const saveTweet = async (content) => {
  const tweetId = await uid.asyncGetUniqueID()

  await Promise.all([
    indexTweet(tweetId, content),
    queryDatabase(`INSERT INTO ${TWEET_TABLE} (tweet_id, content) VALUES (${tweetId}, "${content}");`)
  ])
}

export const getTweetsById = async tweetIds => {
  const { tweets, idsNotInCache } = await cache.get(tweetIds)

  if (!idsNotInCache.length) {
    return tweets
  }

  const formattedTweetIds = idsNotInCache.reduce((acc, item) => {
    if (!acc.length) {
      return `${item}`
    }
    return `${acc}, ${item}`
  }, '')
  const tweetsFromDb = await queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE tweet_id in (${formattedTweetIds});`)
  tweetsFromDb.map(cache.set)

  return [...tweets, ...tweetsFromDb]
}

export const getTweetsByQuery = query => {
  return queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE MATCH (content) AGAINST ("${query}");`)
}
