// import axios and express
import axios from "axios"
import express from "express"
import dotenv from "dotenv"
import pg from "pg"
import bodyParser from "body-parser"
import { Console } from "console"
import { title } from "process"
// create db and connct to it
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "toor",
  port: 5432,
})

const api = "https://covers.openlibrary.org/b/isbn/"

db.connect()

dotenv.config()

// const key = process.env.CRYPTO_CURRENCY_API_KEY

// initialize express and port
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
// declare static diectory for accessing all static files, images etc
app.use(express.static("public"))

async function coverArt(isbn) {
  console.log(url)
  return url
}

// set default route to index.ejs
app.get("/", async (req, res) => {
  const result = await db.query("Select * from items")
  let bookList = []
  let books = result.rows
  books.forEach((book) => {
    let obj = {
      title: book.title,
      isbn: book.isbn,
      read: book.readon,
      rating: book.rating,
      notes: book.notes,
      image: api + book.isbn + "-M.jpg",
    }
    bookList.push(obj)
  })
  res.render("index.ejs", { books: bookList })
})

// add page
app.get("/add", async (req, res) => {
  res.render("addBook.ejs")
})

// edit page
app.post("/edit-book", async (req, res) => {
  const result = req.body
  const book = await db.query(`SELECT * from items WHERE title =($1)`,[result.name])
  const date = new Date()
  const d = book.rows[0]
  
  console.log(d.readon.toISOString().split('T')[0])
  // console.log(book.rows[0])

  // app.get("/edit")
  // const result = db.query(`SELECT * from items where title =  `)
  res.render("editBook.ejs",{book:book.rows[0]})
})

// can just delete from the main page with action

app.post("/add", async (req, res) => {
  try {
    // let poster = await axios.get(api + `${req.body["isbn"]}-M.jpg`)
    const book = {
      title: req.body["title"].toString(),
      isbn: req.body["isbn"].toString(),
      rating: req.body["rating"],
      date: req.body["date"],
      notes: req.body["notes"],
    }

    await db.query(
      "INSERT INTO items (title,notes,readon,rating,isbn) VALUES ($1,$2,$3,$4,$5);",
      [book.title, book.notes, book.date, book.rating, book.isbn]
    )
    res.redirect("/")
  } catch (err) {
    console.log(err.message)
  }
})

// app.post("/update",async (req, res) => {
//   // const book = {
//   //   title: req.body["title"],
//   //   isbn: req.body["isbn"],
//   //   rating: req.body["rating"],
//   //   date: req.body["date"],
//   //   notes: req.body["notes"],
//   // }
//   await db.query(
//     "INSERT INTO items WHERE (title) = (title,notes,readon,rating,isbn) VALUES ($1,$2,$3,$4,$5);",
//     [book.title, book.notes, book.date, book.rating, book.isbn]
//   )
// })

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
