const express = require('express')
const {deleteBook, createNewBook} = require("../models");
const {getAllBooks, getAllCategories, getBook} = require("../models");
const router = express.Router()

router.use(express.urlencoded({extended: true}))
router.route('/api').get(async (req, res) => {


    // let message = 'List of available books'
    let books = []
    try {
        books = await getAllBooks()
        // books.forEach(book=>console.log(book))
    } catch (e) {
        console.log(e)
        res.statusCode = 404
        res.send('Error')
    }
    // res.render('books/index', {message, books})
    res.json(books)
}).post(async (req, res) => {
    let newBook = req.body
    // console.log(newBook)
    try {

        newBook = await createNewBook(newBook.title, newBook.authors.split(','), newBook.category, newBook.price)
        res.json(newBook)
    } catch (e) {
        req.statusCode = 404
        res.end()
    }
})
router.route('/').get(async (req, res) => {


    let message = 'List of available books'
    let books = []
    try {
        books = await getAllBooks()
    } catch (e) {
        console.log(e)
        res.statusCode = 404
        res.send('Error')
    }
    res.render('books/index', {message, books})
})
    .post(async (req, res) => {
        let newBook = req.body
        console.log(newBook)
        try {

            await createNewBook(newBook.title, newBook.authors.split(','), newBook.category, newBook.price)
            res.redirect('./books')
        } catch (e) {

            console.log(e)
            try {

                let book = await getBook(req.params.bookId)

            } catch (e) {
                req.statusCode = 404
                res.end()
            }

        }
    })
// .put(async (req, res) => {
//     console.log(req.body)
//     res.render('books/add_book', {fields, message: ''})
// })
router.route('/add_book').get(async (req, res) => {
    let categories = []
    try {
        categories = await getAllCategories()
    } catch (e) {
        console.log(e)
        res.statusCode = 404
        res.send('error from db')
    }
    let fields = [
        {name: 'title', type: 'text'},
        {name: 'authors', type: 'text'},
        {name: 'price', type: 'number'},
        {name: 'category', type: 'select', options: categories},
    ]
    res.render('books/add_book', {fields, title: 'Add book'})
})

router.route('/api/:bookId').delete(async (req, res) => {
    try {
        await deleteBook(req.params.bookId)
        res.json({success: true})
    } catch (e) {
        console.log(e)
        res.json({success: false})
    }
})
router.route('/:bookId').get(async (req, res) => {
    let book
    let categories = []
    try {
        book = await getBook(req.params.bookId)
        categories = await getAllCategories()
        book.authors = book.authors.name.join(',')
        let fields = [
            {name: 'title', type: 'text'},
            {name: 'authors', type: 'text'},
            {name: 'price', type: 'number'},
            {name: 'category', type: 'select', options: categories},
        ]
        // console.log(book, fields)
        res.render('books/edit_book', {title: 'Edit book', book, fields})
    } catch (e) {
        console.log(e)
        res.statusCode = 404
        res.send('error from db')
    }

}).delete(
    async (req, res) => {
        try {
            await deleteBook(req.params.bookId)
            res.json({success: true})
        } catch (e) {
            console.log(e)
            res.json({success: false})
        }
    }
)
module.exports = router