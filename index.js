// import axios and express
import axios from "axios"
import express from "express"
import dotenv from "dotenv"
import pg from "pg"
import bodyParser from "body-parser"
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

// set default route to index.ejs
app.get("/", async (req, res) => {
  const result = await db.query("Select * from items")
  let bookList = []
  let books = result.rows
  books.forEach((book) => {
    bookList.push(book)
  })
  console.log(bookList)

  res.render("index.ejs", { books: bookList})
})

// add page
app.get("/add", async (req, res) => {
  res.render("addBook.ejs")
})

// edit page
app.get("/edit", async (req, res) => {
  res.render("editBook.ejs")
})

// can just delete from the main page with action

app.post("/add", async (req, res) => {
  try {
    const book = {
      title: req.body["title"].toString(),
      isbn: req.body["isbn"],
      rating: req.body["rating"],
      date: req.body["date"],
      notes: req.body["notes"],
    }

    await db.query(
      "INSERT INTO items (title,notes,readon,rating,isbn) VALUES ($1,$2,$3,$4,$5);",
      [book.title, book.notes, book.date, book.rating, book.isbn]
    )
    const data = db.query(`SELECT * FROM items WHERE isbn = ${book.isbn}`)
    if (data) {
      console.log(data.data)
    }
    res.redirect("/")
  } catch (err) {
    console.log(err.message)
  }
})

app.post("/update", (req, res) => {
  const book = {
    title: req.body["title"].toString(),
    isbn: req.body["isbn"],
    rating: req.body["rating"],
    date: req.body["date"],
    notes: req.body["notes"],
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
