const rls = require('readline-sync')
const mg = require('mongoose')
const {getAllUnissuedBooks} = require("./models/book/controllers");
const {
    getAllCategories, createNewCategory,
    deleteCategory, getCategory
} = require('./models/category/controllers')
const {getAllBooks, createNewBook, deleteBook, searchBook} = require('./models/book/controllers')

const {getAllMembers, createNewMember, deleteMember, searchMember, getAllUnissuedMembers} = require('./models/member/controllers')
const {createNewIssue, deleteIssue,  closeIssue,searchIssue, getAllIssuesWithBook} = require('./models/issue/controllers')

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

async function main() {

    let title, authors, category, price, bookIndex, catIndex, categories
    console.log('--------------Operations for Category--------------------')
    let steps = [
        'See all Categories', 'Add new Category', 'Delete a category\n--------------Operations for Book--------------------',
        'See all Books', 'Add new Book', 'Delete a Book',
        'Search a Book', 'See books for a category\n--------------Operations for Member--------------------',
        'List the members', 'Add a new member',
        'Delete a member\n--------------Operations for Issue--------------------',
        'Issue a Book', 'Return a book', 'See active issues', 'Get issue history of a book'
    ]
    let index = NaN
    while (index !== -1) {
        index = rls.keyInSelect(steps, 'What you want to do?\n')
        console.log(steps[index].split('\n')[0])
        switch (index) {
            case 0:
                try {

                    let categories = await getAllCategories()
                    if (categories.length) {
                        categories.forEach((cat) => console.log(cat.name))
                    } else console.log('no category yet')
                } catch (e) {
                    console.log(e)
                }

                break
            case 1:
                title = rls.question('what is the new category?\n')
                try {
                    await createNewCategory(title)
                } catch (e) {

                    console.log(e)
                }
                break
            case 2:
                catIndex = NaN
                while (catIndex !== -1) {
                    try {
                        categories = await getAllCategories()
                        if (categories.length) {
                            catIndex = rls.keyInSelect(categories.map((cat) => cat.name), 'Which category you want to delete?')
                            switch (catIndex) {
                                case -1:
                                    console.log('going to main menu')
                                    break
                                default:
                                    let category = categories[catIndex]
                                    try {
                                        await deleteCategory(category._id)
                                        console.log(category.name, 'successfully deleted!')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    break
                            }
                        }

                    } catch (e) {
                        console.log(e)
                    }
                }

                break
            case 3:
                let books = await getAllBooks()
                if (books.length) {
                    books.forEach((cat) => console.log(cat.title))
                } else console.log('no books yet')
                break
            case 4:
                title = rls.question('what is the title of new book?\n')
                authors = rls.question('who are the authors of this book?\n')
                price = rls.question('what is the price of this book?\n')
                catIndex = NaN
                while (catIndex !== -1) {
                    try {
                        categories = await getAllCategories()
                        if (categories.length) {
                            catIndex = rls.keyInSelect(categories.map((cat) => cat.name), 'Which category you want to add this book?')
                            switch (catIndex) {
                                case -1:
                                    console.log('adding book is canceled. going to main menu')
                                    break
                                default:
                                    let category = categories[catIndex]
                                    try {
                                        await createNewBook(title,authors.split(','),category._id, price)
                                        console.log('book',title, ' is successfully created!')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    catIndex = -1
                                    break
                            }
                        }

                    } catch (e) {
                        console.log(e)
                    }
                }
                break
            case 5:
                bookIndex = NaN
                while (bookIndex !== -1) {
                    try {
                        let books = await getAllBooks()
                        if (books.length) {
                            bookIndex = rls.keyInSelect(books.map((book) => book.title), 'Choose a book to delete:')
                            switch (bookIndex) {
                                case -1:
                                    console.log('going back to main menu')
                                    break
                                default:
                                    let book = books[bookIndex]
                                    try {
                                        await deleteBook(book._id)
                                        console.log(book.title, 'is deleted successfully!')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    break
                            }
                            bookIndex = -1
                        } else {
                            console.log('no books yet')
                            bookIndex = -1
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                break
            case 6:
                title = rls.question('what is the keyword?\n')
                if (title.length < 4) {
                    console.log('search query must be at least 4 character length')
                    break
                }
                try {
                    let results = await searchBook(title, 'title')
                    if (results.length) results.forEach((res) => console.log(res.title))
                    else console.log('Not found')
                } catch (e) {
                    console.log(e)
                }
                break
            case 7:
                categories = await getAllCategories()
                if (!categories.length) {
                    console.log('no categories yet')
                    break
                }
                catIndex = NaN
                while (catIndex !== -1) {
                    catIndex = rls.keyInSelect(categories.map((cat) => cat.name), 'What category of book you want to see?\n')
                    switch (catIndex) {
                        case -1:
                            console.log('going back to main menu')
                            break
                        default:
                            try {
                                let results = await searchBook(categories[catIndex]._id, 'category')
                                if (results.length) {
                                    console.log('List of books under category: ', categories[catIndex].name)
                                    results.forEach((res) => console.log(res.title))
                                } else console.log('no books yet in this category')
                            } catch (e) {
                                console.log(e)
                            }
                            break
                    }
                }
                break
            case 8:
                try {
                    let members = await getAllMembers()
                    if (members.length) {
                        console.log('All the members are below:')
                        members.forEach((mem) => console.log(mem.name))
                    } else console.log('no members yet')

                } catch (e) {
                    console.log(e)
                }

                break
            case 9:
                let name = rls.question('What is the name of the new member?\n')
                try {
                    await createNewMember(name)
                    console.log(name, 'member is registered!')
                } catch (e) {
                    console.log(e)
                }
                break
            case 10:
                try {
                    let memIndex = NaN
                    while (memIndex !== -1) {
                        let members = await getAllMembers()
                        if (members.length) {
                            console.log('All the members are below:')
                            memIndex = rls.keyInSelect(members.map((mem) => mem.name), 'Whom do you want to unregister?')
                            switch (memIndex) {
                                case -1:
                                    console.log('going back to main menu')
                                    break
                                default:
                                    try {
                                        await deleteMember(members[memIndex].memberId)
                                        console.log(members[memIndex].name, 'is unregistered!')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    break
                            }
                        } else console.log('no members yet')
                    }
                } catch (e) {
                    console.log(e)
                }
                break
            case 11:
                // set the member
                try {
                    let memIndex = NaN
                    while (memIndex !== -1) {
                        // let members = await getAllMembers()
                        let issues = await searchIssue(true, 'open')
                        let memberIds = issues.map((mem)=>mem.member)
                        // console.log(memberIds, 'memberIds')
                        let members = await getAllUnissuedMembers(memberIds)
                        if (members.length) {
                            console.log('All the members are below:')
                            memIndex = rls.keyInSelect(members.map((mem) => mem.name), 'Whom do you want to issue a book?')
                            switch (memIndex) {
                                case -1:
                                    console.log('going back to main menu')
                                    break
                                default:
                                    let bookIndex = NaN
                                    try {
                                        while (bookIndex !== -1) {
                                            let books = await getAllUnissuedBooks(issues.map((mem)=>mem.book))
                                            if (books.length) {
                                                bookIndex = rls.keyInSelect(books.map((book) => book.title), 'Which book do you want to issue?')
                                                switch (bookIndex) {
                                                    case -1:
                                                        console.log('going back to main menu')
                                                        break
                                                    default:
                                                        let book = books[bookIndex]
                                                        let member = members[memIndex]
                                                        let issuedUser = await searchIssue(member, 'member')
                                                        let issuedBook = await searchIssue(book, 'book')
                                                        if (issuedBook.filter((iss)=>iss.open).length || issuedUser.filter((iss)=>iss.open).length) {
                                                            console.log('The book or the user is already issued', issuedUser, issuedBook)
                                                        } else {
                                                            try {
                                                                await createNewIssue(member._id, book._id)
                                                                console.log(book.title, ' is issued to ', member.name, '!')
                                                            } catch (e) {
                                                                console.log(e)
                                                            }
                                                        }
                                                        break
                                                }
                                                memIndex = -1
                                                bookIndex = -1
                                            } else {
                                                console.log('no books yet')
                                                bookIndex = -1
                                                memIndex = -1
                                            }
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    break
                            }
                        } else {
                            console.log('no members yet')
                            memIndex = -1
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
                break
            case 12:
                let issueIndex = NaN
                try {
                    while (issueIndex !== -1) {
                        let issues = await searchIssue(true, 'open')
                        if (issues.length) {
                            issueIndex = rls.keyInSelect(issues.map((issue) => issue.book.title), 'Which book do you want to return?')
                            switch (issueIndex) {
                                case -1:
                                    console.log('going back to main menu')
                                    break
                                default:
                                    let issue = issues[issueIndex]
                                    try {
                                        await closeIssue(issue._id)
                                        console.log(issue.book.title, 'is received!')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    break
                            }
                        } else {
                            console.log('no issues yet')
                            issueIndex = -1
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
                break
            case 13:
                let issues = await searchIssue(true, 'open')
                if (issues.length) {
                    issues.forEach((iss) => {
                        console.log(iss.book.title, 'is issued by', iss.member.name)
                    })
                } else console.log('no issues yet')
                break
            case 14:
                bookIndex = NaN
                try {
                    while (bookIndex !== -1) {
                        let books = await getAllBooks()
                        if (books.length) {
                            bookIndex = rls.keyInSelect(books.map((book) => book.title), 'Choose a book to see issue history:')
                            switch (bookIndex) {
                                case -1:
                                    console.log('going back to main menu')
                                    break
                                default:
                                    let book = books[bookIndex]

                                    let issues = await searchIssue(book._id, 'book')
                                    if (issues.length) {
                                        console.log(book.title, 'has been issued by:')
                                        issues.forEach((iss) => {
                                            console.log(iss.member.name)
                                        })
                                    } else console.log('no issues for this book')
                                    break
                            }
                            bookIndex = -1
                        } else {
                            console.log('no books yet')
                            bookIndex = -1
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
                break
            default:
                console.log('bye')
                break
        }
    }
    // process.exit(1)
}

main()
