import mysql from 'mysql'
const { 
    MYSQL_HOST: host,
    MYSQL_ROOT_PASSWORD: password,
    MYSQL_DATABASE: database,
    MYSQL_CONNECTION_LIMIT: connectionLimit
}  = process.env
console.log(`connetion info`, {
    connectionLimit,
    host,
    user: 'root',
    password,
    database,
})
const pool  = mysql.createPool({
    connectionLimit,
    host,
    user: 'root',
    password,
    database,
    debug: true
})

export const TWEET_TABLE = 'tweets'

export const queryDatabase = async query => {
    return new Promise((res, rej) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                rej(err)
                return 
            }
        
            connection.query(query, function (error, results, fields) {
                connection.release()
                 
                if (error) {
                    rej(error)
                    return
                }
                
                console.log(`results`, results)
                console.log(`fields`, fields)
                res(results)
            })
        })
    })   
}