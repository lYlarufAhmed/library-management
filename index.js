const rls = require('readline-sync')
const mg = require('mongoose')
const {
    getAllCategories, createNewCategory,
    deleteCategory, getCategory
} = require('./models/category/controllers')
const {getAllBooks, createNewBook, deleteBook, searchBook} = require('./models/book/controllers')

async function createConnection() {
    console.log('Welcome to my library')
    await mg.connect('mongodb://127.0.0.1:27017/library', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

}

// const conn = mg.connection
createConnection()

function main() {

    let steps = [
        'See all Categories', 'Add new Category', 'Delete a category',
        'See all Books', 'Add new Book', 'Delete a Book(by title)',
        'Search a Book'
    ]
    let index = rls.keyInSelect(steps, 'What you want to do?')
    // while (true) {
    let title, author, category, price
    switch (index) {
        case 0:
            getAllCategories().then(categories => {
                if (categories.length) {
                    categories.forEach((cat) => console.log(cat.name))
                } else console.log('no category yet')
            })

            break
        case 1:
            title = rls.question('what is the new category?')
            createNewCategory(title).then(() => {
                console.log('created successfully')
            }).catch(e => {
                console.log(e)
            })
            break
        case 2:
            title = rls.question('what is the new category?')
            deleteCategory(title).then(del => {
                if (del) console.log('deleted successfully')
                else console.log('not found')
            }).catch(e => {
                console.log(e)
            })
            break
        case 3:
            getAllBooks().then(books => {
                if (books.length) {
                    books.forEach((cat) => console.log(cat.title))
                } else console.log('no books yet')
            })

            break
        case 4:
            title = rls.question('what is the title of new book?')
            author = rls.question('who are the authors of this book?')
            category = rls.question('what is the category of this book?')
            price = rls.question('what is the price of this book?')
            let categoryObj = getCategory(category)
            if (categoryObj) {
                createNewBook(title, {name: author.split(',')}, categoryObj.id, price).then(() => {
                    console.log('created successfully')
                }).catch(e => {
                    console.log(e)
                })
            } else {
                console.log('Category not found')
                let categories = getAllCategories()
                if (categories.length) {

                    console.log('here are the available ones')
                    categories.forEach((cat) => console.log(cat))
                } else {
                    console.log('currently no categories')
                }
            }
            // const newcategory = categorymodel({name: ''})
            break
        case 5:
            title = rls.question('what is the title of the book?')
            deleteBook(title).then(del => {
                if (del) console.log('deleted successfully')
                else console.log('not found')
            }).catch(e => {
                console.log(e)
            })
            break
        case 6:
            title = rls.question('what is the keyword?')
            if (title.length<4) {
                console.log('search query must be at least 4 charecter length')
                break
            }
            searchBook(title).then(results => {

                if (results.length) results.forEach((res) => console.log(res.title))
                else console.log('Not found')
            }).catch(e=>{
                console.log(e)
            })
            break
        default:
            console.log('exiting')
            process.exit(1)

    }
    // }
    // process.exit(1)
}

main()
