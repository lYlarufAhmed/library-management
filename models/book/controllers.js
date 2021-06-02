const mg = require('mongoose')
const BookSchema = require('./schema')
let Book = new mg.model('Book', BookSchema)
let getAllBooks = async () => await Book.find()
let createNewBook = async (title, authors, category,price) => {
    let buffer = new Book({title, authors, category,price})
    await buffer.save()
}
let deleteBook = async (title) => {
    let instance = await Book.findOne({title}, (err) => {
        return false
    })
    if (instance) {
        instance.remove()
        return true
    }
    return false
}

let searchBookByTitle = async (query)=>{
    let results = await Book.find()
    // console.log(results)
    return results.filter((res)=>res.title.toLowerCase().includes(query))
    // console.log(filtered)
}

module.exports = {
    getAllBooks,
    createNewBook,
    deleteBook,
    searchBook: searchBookByTitle
}
