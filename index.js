// import axios and express
import axios from "axios"
import express from "express"
import dotenv from "dotenv"
import pg from "pg"

// create db and connct to it
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "toor",
  port: 5432,
})
db.connect()

dotenv.config()

// const key = process.env.CRYPTO_CURRENCY_API_KEY

// initialize express and port
const app = express()
const port = 3000

// declare static diectory for accessing all static files, images etc
app.use(express.static("public"))

// set default route to index.ejs
app.get("/", async (req, res) => {
  res.render("index.ejs")
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
