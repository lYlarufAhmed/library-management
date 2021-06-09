const express = require('express')
const morgan = require('morgan')
const app = express()
const bookRoutes = require('./routes/books')
const cors = require('cors')


const PORT = 3001

app.use(morgan('dev'))
app.use(express.static('static'))
app.use(cors())
app.set('view engine', 'pug')
app.use('/books', bookRoutes)

app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.render('index', {message: 'Welcome to the library'})
})


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})