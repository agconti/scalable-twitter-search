# scalable-twitter-search
A walkthrough of how to do full-text search at Twitter's scale. 

This is the first installment of tutorial series that aims to explain practical distributed system techniques through examples of real-world architecture. This project includes a detailed walkthrough of designing the architecture from the group up and a barebones implementation of the architecture so you can poke, prod, and explore how it works. 


Some expectations around the barebones implementation: 

- The focus is on the architecture behind this implementation. To highlight and most easily deliver the notion of how it works; the implementation intentionally ignores the best practice minutiae of implementing a system like this in production. For example, there's no validation on client input, and the MySQL driver is used directly rather than an ORM to make it clear what queries are being issued. 
- The implementation is in Node.js to make it as approachable and readable by as many developers as possible. Most programmers have some exposure to JavaScript, and for those that don't; they'll find the syntax familiar and easy to read. 
- The implementation's local deployment will be scaled down from the production scale the walkthrough outlines so it's possible to run on a laptop. 

Here's a sneak peak of what we'll be building: 

![architecutre diagram](./docs/scalable-twitter-search.svg)

## Requirements of the system

### Functional Requirements

### Non-Functional Requirements

## Capacity Estimation

## High-Level Design

## Detailed Design 

### Storage

### Index
![arch diagram](./docs/scalable-twitter-search.svg)

## Caching

## Running the implementation

Perquisites: 

- [Docker](https://www.docker.com/products/docker-desktop)

Bring up the implementation:

`docker-compose up`

Add your own tweets:

```
docker exec -it <application container id> bash
node scripts/load-tweets.js tweet-csv-data/tweets.csv
```

Or: 

```
curl -d '{"content": "My first tweet!"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tweets
```

Search for tweets: 

```
curl  http://localhost:3000/tweets?query=tweet
```