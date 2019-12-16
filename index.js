import express from 'express'
import morgan from 'morgan'
import { create, search } from './tweets.js'
const { PORT } = process.env
const app = express()

app.use(express.json())
app.use(morgan('combined'))

app.get('/', (req, res) => res.send('Scalable Search'))

app.post('/tweets', create)
app.get('/tweets', search)

app.listen(PORT)
console.log(`Running on port ${PORT}`)
