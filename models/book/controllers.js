const Book = require('./schema')
let getAllBooks = async () => await Book.find().populate('category', 'name')
let createNewBook = async (title, authors, category, price) => {
    let buffer = new Book({title, authors:{name: authors}, category, price})
    await buffer.save()
    return buffer
}
let deleteBook = async (_id) => {
    await Book.findOne({_id}, (err, book) => {
        if (book) book.remove()
        if (err) {
            console.log(err)
            throw Error('Error deleting book')
        }
    })
}

let searchBook = async (query, by) => {
    if (by === 'title')
        return await Book.find({title: {$regex: query, $options: 'i'}})
    else return await Book.find({category: query})
}

let getBook = async (_id) =>{
    return await Book.findOne({_id}).populate('category','name')
}

let getAllUnissuedBooks = async (ids)=>{
    return await Book.find({_id: {$nin: ids}})
}

module.exports = {
    getAllBooks,
    createNewBook,
    deleteBook,
    searchBook: searchBook,
    getAllUnissuedBooks,
    getBook
}
