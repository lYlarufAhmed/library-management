const jwt = require('jsonwebtoken')
const verifyBearerHeader = (req, res, next) => {
    console.log(req.url)
    if (req.url.includes('/api')) {
        if (req.headers['authorization']) {
            let token = req.headers['authorization'].split(' ')[1]
            console.log('verify header', token)
            if (token !== null) {
                try {
                    let data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                    console.log(data)
                    next()
                } catch (e) {
                    // res.status(401).json({success: false, message: e.message})
                    console.log(e)
                    res.sendStatus(401)
                }
            } else {
                // res.status(403).json({success: false, message: 'No token provided'})
                res.sendStatus(403)
            }
        } else {
            // res.status(403).json({success: false, message: 'No token provided'})
            res.sendStatus(403)
        }
    } else {
        next()
    }
}
module.exports = {
    verifyBearerHeader
}

