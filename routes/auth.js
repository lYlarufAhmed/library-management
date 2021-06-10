const express = require('express')
const {getUsers} = require("../models");
const {createNewUser} = require("../models/user/controllers");
const {createNewBook} = require("../models");
const router = express.Router()

const multer = require('multer')
const upload = multer({dest: 'auth/uploads/'})


router.route('/')
    .post(upload.single('avatar'), async (req, res) => {
        try {
            console.log(req.body)
            let data = req.body
            let status = await createNewUser(data.name, data.email, data.password)
            // res.status(500)
            if (status.success) {
                res.status(500)
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

    })

module.exports = router