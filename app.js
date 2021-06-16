const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const bookRoutes = require('./routes/books')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/auth')
const cors = require('cors')


const PORT = 3001

app.use(morgan('dev'))
app.use(express.static('static'))
app.use(cors())
app.set('view engine', 'pug')
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/books', bookRoutes)
app.use('/auth', authRoutes)
app.use('/categories', categoryRoutes)

app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.render('index', {message: 'Welcome to the library'})
})


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})