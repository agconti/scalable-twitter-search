import * as db from './db'
import * as indexServer from './index-server'

const search = async (req, res) => {
    const { params: { query } } = req

        const tweetIds = await indexServer.getTweetIdsFromIndex(query)
        const noIndexedTweetsForQuery = tweetIds.length < 1

        if (noIndexedTweetsForQuery) {
            const tweets = await db.getTweetsByQuery(query)
            res.json(tweets)
        }
        
        const tweets = await db.getTweetsById(tweetIds)
        res.json(tweets)
}

export default search