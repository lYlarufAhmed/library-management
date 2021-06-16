const jwt = require('jsonwebtoken')
const verifyBearerHeader = (req, res, next) => {
    console.log(req.url)
    if (req.url.includes('/api')) {
        if (req.headers['authorization']) {
            let token = req.headers['authorization'].split(' ')[1]
            console.log('verify header', token)
            if (token) {
                try {
                    let data = jwt.verify(token, process.env.APP_SECRET)
                    console.log(data)
                    next()
                } catch (e) {
                    res.status(403).json({success: false, message: e.message})
                }
            } else {
                res.status(403).json({success: false, message: 'No token provided'})
            }
        } else {
            res.status(403).json({success: false, message: 'No token provided'})
        }
    } else {
        next()
    }
}
module.exports = {
    verifyBearerHeader
}

