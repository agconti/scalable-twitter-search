
import * as fs from 'fs'
import csv from 'fast-csv'
import { saveTweet } from '../tweets.js'
const [csvPath] = process.argv.slice(2)
const headers = true
const csvParseOptions = { headers }

console.log(`Starting upload for tweets in ${csvPath}`)
fs.createReadStream(csvPath)
  .pipe(csv.parse(csvParseOptions))
  .on('data', async ({ content }) => {
    try {
      await saveTweet(content)
    } catch (e) {
      console.error(e)
    }
  })
  .on('error', err => console.error(err))
  .on('end', rowCount => {
    console.log(`Finished uploading ${rowCount} records from ${csvPath}.`)
    process.exit(0)
  })