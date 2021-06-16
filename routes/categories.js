const express = require('express')
const router = express.Router()
const {verifyBearerHeader} = require('../middlewares')
const {getAllCategories} = require('../models')


router.use(verifyBearerHeader)
router.route('/api')
    .get(async (req, res)=>{
        let categories = await getAllCategories()
    })

module.exports = router

