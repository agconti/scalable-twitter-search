
import CRC32 from 'crc-32'
import mysql from 'mysql'
import { tweetSerializer } from './serializers.js'
const charset = 'utf8mb4'
const {
  MYSQL_HOST_SHARD_1: shardOneHost,
  MYSQL_HOST_SHARD_2: shardTwoHost,
  MYSQL_ROOT_PASSWORD: password,
  MYSQL_USER: user,
  MYSQL_DATABASE: database,
  MYSQL_CONNECTION_LIMIT: connectionLimit,
  MYSQL_DEBUG: debug
} = process.env
const TWEET_TABLE = 'tweets'
const databaseServers = [
  mysql.createPool({ host: shardOneHost, user, password, database, charset, connectionLimit, debug }),
  mysql.createPool({ host: shardTwoHost, user, password, database, charset, connectionLimit, debug })
]

const queryDatabase = async (shardId, query) => {
  return new Promise((resolve, reject) => {
    const shard = databaseServers[shardId]
    shard.getConnection((err, connection) => {
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

        if (Array.isArray(results)) {
          const serializedResults = results.map(tweetSerializer)
          resolve(serializedResults)
          return
        }
        return resolve(results)
      })
    })
  })
}

const shardKey = id => Math.abs(CRC32.str(`${id}`)) % databaseServers.length

const formatIds = ids => ids.reduce((acc, id) => {
  if (!acc.length) {
    return `${id}`
  }
  return `${acc}, ${id}`
}, '')

const groupByShardKey = ids => {
  return ids.reduce((acc, id) => {
    const shardId = shardKey(id)
    const groupedIds = acc[shardId] || []

    return {
      ...acc,
      [shardId]: [...groupedIds, id]
    }
  }, {})
}

export const getByIds = async ids => {
  const shardGroups = groupByShardKey(ids)
  const requests = Object.entries(shardGroups)
    .map(([shardId, idsOnShard]) => {
      return queryDatabase(
        shardId,
        `SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE tweet_id in (${formatIds(idsOnShard)});`
      )
    })

  const result = await Promise.all(requests).then(results => results.reduce((acc, item) => [...acc, ...item], []))
  return result
}

export const insert = ({ tweetId, content }) => {
  const shardId = shardKey(tweetId)
  const server = databaseServers[shardId]
  return queryDatabase(shardId, `INSERT INTO ${TWEET_TABLE} (tweet_id, content) VALUES (${tweetId}, "${server.escape(content)}");`)
}

export const fullTextSearch = async query => {
  const requests = databaseServers.map((server, shardId) => {
    return queryDatabase(shardId, `SELECT tweet_id, content FROM ${TWEET_TABLE} WHERE MATCH (content) AGAINST ("${server.escape(query)}");`)
  })

  const result = await Promise.all(requests).then(results => results.reduce((acc, item) => [...acc, ...item], []))
  return result
}
