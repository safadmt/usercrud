const {MongoClient} = require('mongodb')
require('dotenv').config()

const url = process.env.URL
const client = new MongoClient(url)


const dbname = 'e-shop'

 async function main () {
    try{
        await client.connect()
       const db = client.db(dbname)
        
        return db
    }catch(err) {
        return err
    }
    
}

module.exports = {main}