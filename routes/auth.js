const express = require('express')
const {getUsers} = require("../models")
const jwt = require('jsonwebtoken')
const {createNewUser, logInUser} = require("../models/user/controllers");
const router = express.Router()

const multer = require('multer')
const refreshTokens = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1ldGFAdGVzLmNvbSIsImlhdCI6MTYyMzc1NTU1NCwiZXhwIjoxNjI0MzYwMzU0fQ.TA8mxox11KZwufaoxtXLntnZHbqfVFi4zcxE7jnJClA",
]

// const multipart = multer()
const storage = new multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/uploads/auth')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({storage})
router.route('/')
    .post(upload.single('avatar'), async (req, res) => {
        try {
            // console.log(req.body)
            // console.log(req.file)
            let data = req.body
            let status = await createNewUser(data.name, data.email, data.password, req.file.filename)
            if (status.success) {
                res.status(201)
            } else {
                res.status(401)
            }
            res.send(status)
        } catch (e) {
            console.log(e)
            res.status(404)
        }
    })
    .get(async (req, res) => {
        try {
            let users = await getUsers()
            res.status(500)
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    })
router.route('/verify')
    .post(async (req, res) => {
        console.log(req.body)
        let status
        try {

            status = await logInUser(req.body.email, req.body.password)
            if (status.success) {
                res.statusCode = 200
                console.log(status)
                let payload = {
                    email: status.loggedInUser.email,
                    // iat: Date.now()
                }
                console.log(payload)
                let token = jwt.sign(payload, process.env.APP_SECRET,
                    {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})
                status.accessToken = token
                let refresh_token = jwt.sign(payload, process.env.APP_SECRET,
                    {expiresIn: process.env.REFRESH_TOKEN_REFRESH_EXPIRES_IN})
                console.log(token, refresh_token)
                status.refreshToken = refresh_token
                refreshTokens.push(refresh_token)
            } else {
                res.statusCode = 401
            }
        } catch (e) {
            status = {success: false, message: 'Server Error'}
            res.statusCode = 404
        }

        res.json(status)
    })

router.route('/token').post(async (req, res) => {
    console.log(req.body)
    //verify refresh token
    // if its in the database and is valid
    let refreshToken = req.body
    if (refreshTokens.includes(refreshToken)) {
        try {
            let data = jwt.verify(refreshToken, process.env.APP_SECRET)
            console.log(data)
            let loggedInUser = jwt.sign({email: data.email}, process.env.APP_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})

            res.status(200).send({success: true, loggedInUser})
        } catch (e) {
            console.log(e)
            res.status(403).send({success: false, message: e.message})
        }
    } else {
        res.status(403).send({success: false, message: 'Refresh token expired!'})
    }
    res.send()
})
module.exports = router