import express from 'express'
import morgan from 'morgan'
import search from './search.js'
import { saveTweet } from './tweets.js'
const { PORT } = process.env
const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/',  (req, res) => res.send('Hello World'))

app.post('/tweets', async function createTweet (req, res) {
    const { content } = req.body
    await saveTweet(content)
    return res.sendStatus(201)
})

app.get('/search', search)

app.listen(PORT)
console.log(`Running on port ${PORT}`);