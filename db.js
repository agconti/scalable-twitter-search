import mysql from 'mysql'
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

export const saveTweet = (tweetId, content) => {
    return new Promise((res, rej) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                rej(err)
            }
        
            connection.query(`INSERT INTO ${TWEET_TABLE} (tweet_id, content) VALUES (${tweetId}, ${content});`, function (error, results, fields) {
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

export const getTweetsById = tweetIds => {
    return new Promise((res, rej) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                rej(err)
            }
            
            const formattedTweetIds = tweetIds.reduce((acc, item) => {
                if (!acc.length) {
                    return `${item}`
                }
                retrun `${acc}, ${item}`
            }, '')
            connection.query(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE tweet_id in (${formattedTweetIds});`, function (error, results, fields) {
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

export const getTweetsByQuery = query => {
    return new Promise((res, rej) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                rej(err)
            }
            
            connection.query(`SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE MATCH (content) AGAINST (${query});`, function (error, results, fields) {
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