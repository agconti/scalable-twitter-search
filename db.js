import mysql from 'mysql'
const {
  MYSQL_HOST: host,
  MYSQL_ROOT_PASSWORD: password,
  MYSQL_DATABASE: database,
  MYSQL_CONNECTION_LIMIT: connectionLimit
} = process.env
const pool = mysql.createPool({
  connectionLimit,
  host,
  user: 'root',
  password,
  database,
  debug: false
})

export const TWEET_TABLE = 'tweets'

export const queryDatabase = async query => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return
      }

      connection.query(query, (error, results) => {
        connection.release()

        if (error) {
          reject(error)
          return
        }

        resolve(results)
      })
    })
  })
}
