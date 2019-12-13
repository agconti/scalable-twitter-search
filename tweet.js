import  { UniqueID } from 'nodejs-snowflake'
import mysql from 'mysql'
import { saveTweet } from './tweet'
import { indexTweet } from './index-server'
const { 
    MYSQL_HOST: host,
    MYSQL_USER: user,
    MYSQL_PASSWORD: password,
    MYSQL_DB: database,
    MYSQL_CONNECTION_LIMIT: connectionLimit
}  = process.env
const pool  = mysql.createPool({
    connectionLimit,
    host,
    user,
    password,
    database,
})
const TWEET_TABLE = 'tweets'

const queryDatabase = async query => {
    return new Promise((res, rej) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                rej(err)
            }
        
            connection.query(query, function (error, results, fields) {
                connection.release()
                
                if (error) {
                    rej(error)
                    return
                }
            
                res(results)
            })
        })
    })   
}

export const saveTweet = async (tweetId, content) => {
    const tweetId = new UniqueID()
    
    await Promise.all([
        indexTweet(tweetId, content),
        queryDatabase(`INSERT INTO ${TWEET_TABLE} (tweet_id, content) VALUES (${tweetId}, ${content});`)
    ])
}

export const getTweetsById = tweetIds => {
    const formattedTweetIds = tweetIds.reduce((acc, item) => {
        if (!acc.length) {
            return `${item}`
        }
        return `${acc}, ${item}`
    }, '')
    return queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE tweet_id in (${formattedTweetIds});`)
}

export const getTweetsByQuery = query => {
    return queryDatabase(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE MATCH (content) AGAINST (${query});`);
}