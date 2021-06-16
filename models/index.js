const mg = require('mongoose')
const {checkHash} = require("./user/controllers");
const {getUsers} = require("./user/controllers");
const {getAllBooks, createNewBook, deleteBook, searchBook, getBook} = require('./book/controllers')
const {
    getAllCategories,
    createNewCategory,
    deleteCategory,
    getCategory
} = require('./category/controllers')

async function createConnection() {
    console.log('Welcome to my library')
    await mg.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

}

createConnection()
module.exports =
    {
        getAllBooks, createNewBook, deleteBook, searchBook, getAllCategories,
        getBook, createNewBook, getUsers
    }