const mg = require('mongoose')
const {getAllBooks, createNewBook, deleteBook, searchBook, getBook} = require('./book/controllers')
const {
    getAllCategories,
    createNewCategory,
    deleteCategory,
    getCategory
} = require('./category/controllers')

async function createConnection() {
    console.log('Welcome to my library')
    await mg.connect('mongodb://127.0.0.1:27017/library', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

}

createConnection()
module.exports =
    {
        getAllBooks, createNewBook, deleteBook, searchBook, getAllCategories,
        getBook
    }