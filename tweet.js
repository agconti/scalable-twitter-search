import { UniqueID } from 'nodejs-snowflake'
import { indexTweet } from './index-server'
import { queryDatabase } from './db'
import * as cache from './database-cache'

export const saveTweet = async (tweetId, content) => {
    const tweetId = new UniqueID()
    
    await Promise.all([
        indexTweet(tweetId, content),
        queryDatabase(`INSERT INTO ${TWEET_TABLE} (tweet_id, content) VALUES (${tweetId}, ${content});`)
    ])
}

export const getTweetsById = tweetIds => {
    const {tweets, idsNotInCache} = await cache.get(tweetIds)

    if (!idsNotInCache.length) {
        return tweets
    }

    const formattedTweetIds = idsNotInCache.reduce((acc, item) => {
        if (!acc.length) {
            return `${item}`
        }
        return `${acc}, ${item}`
    }, '')
    tweetsFromDb = await queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE tweet_id in (${formattedTweetIds});`)
    tweetsFromDb.map(cache.set)

    return [...tweets, ...tweetsFromDb]
}

export const getTweetsByQuery = query => {
    return queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE MATCH (content) AGAINST (${query});`);
}