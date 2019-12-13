import  { UniqueID } from 'nodejs-snowflake'
import { saveTweet } from './db'

export const createTweet = (content) => {
    const words = content.split(" ")
    const cacheIdWordPairs = words.map(wordToIndexServer)
    const tweetId = new UniqueID()
    
    const indexSaveRequests = cacheIdWordPairs.map(([cacheId, word]) => cacheTweetInIndexForWord(cacheId, word, tweetId))
    const indexBuilderSave = await saveInIndexBuilder(cacheIdWordPairs)

    await Promise.all([...indexSaveRequests, ...indexBuilderSave, saveTweet(tweetId, content)])
}