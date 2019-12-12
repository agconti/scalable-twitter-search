import { search } from './search'
const { PORT }  = process.env
const express = require('express')
const app = express()

app.get('/',  (req, res) => res.send('Hello World'))
app.get('/search', search)

app.listen(PORT)
console.log(`Running on port ${PORT}`);