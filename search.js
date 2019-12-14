import * as db from './tweets.js'
import * as indexServer from './index-server.js'

const search = async (req, res) => {
    const { query: { query } } = req
    const tweetIds = await indexServer.getTweetIdsFromIndex(query)
    const noIndexedTweetsForQuery = tweetIds.length < 1

    if (noIndexedTweetsForQuery) {
        const tweets = await db.getTweetsByQuery(query)
        res.json(tweets)
        return
    }
    
    const tweets = await db.getTweetsById(tweetIds)
    res.json(tweets)
}

export default search