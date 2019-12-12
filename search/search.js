const wordToIndexServerHash = word => {
    const cachId = hash(word)
    return [cachId, word]
}

const getTweetIdsFromIndex = async query => {
    const words = query.split(" ")
    const cacheIdWordPairs = words.map(wordToIndexServerHash)

    const cacheRequests = cacheIdWordPairs.map(([cacheId, word]) => getFromCache(cacheId, word))
    const tweetIds = await Promise.all(cacheRequests).then(items => items.flat())

    return tweetIds

}

const getTweetsfromDatabase = async tweetIds => {
    const example_query = `SELECT * FROM tweets WHERE id in (${tweetIds})`
    return [{ id: 1, content: "Hello"}, { id: 2, content: "World"}]
}

const search = async (req, res) => {
    const { params: { query } } = req
    try {
        const tweetIds = await getTweetIdsFromIndex(query)
        const tweets = await getTweetsfromDatabase(tweetIds)
        res.json(tweets)
    } catch (e) {
        console.error(e)
        res.sendStatus(50)  
    }
}

export default search