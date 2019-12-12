const CRC32 = require('crc-32')

const wordToIndexServer = word => {
    NUM_CACHES = 4
    const cacheId = Math.abs(CRC32.str(word)) % NUM_CACHES
    return [cacheId, word]
}

const getTweetIdsFromIndex = async query => {
    const words = query.split(" ")
    const cacheIdWordPairs = words.map(wordToIndexServer)

    const cacheRequests = cacheIdWordPairs.map(([cacheId, word]) => getTweeIdsContainingWordFromIndex(cacheId, word))
    const tweetIds = await Promise.all(cacheRequests).then(items => items.flat())

    return tweetIds

}

const getTweetsFromDatabase = async tweetIds => {
    const example_query = `SELECT * FROM tweets WHERE id in (${tweetIds})`
    return [{ id: 1, content: "Hello"}, { id: 2, content: "World"}]
}

const search = async (req, res) => {
    const { params: { query } } = req
    try {
        const tweetIds = await getTweetIdsFromIndex(query)
        const tweets = await getTweetsFromDatabase(tweetIds)
        res.json(tweets)
    } catch (e) {
        console.error(e)
        res.sendStatus(500)  
    }
}

export default search