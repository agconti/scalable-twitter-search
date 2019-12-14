import mysql from 'mysql'
const { 
    MYSQL_HOST: host,
    MYSQL_ROOT_PASSWORD: password,
    MYSQL_DATABASE: database,
    MYSQL_CONNECTION_LIMIT: connectionLimit
}  = process.env
const pool  = mysql.createPool({
    connectionLimit,
    host,
    user: 'root',
    password,
    database,
    debug: false
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

                res(results)
            })
        })
    })   
}