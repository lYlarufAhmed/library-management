let User = require('./schema')
let bcrypt = require('bcrypt')
const emailREGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

let createNewUser = async (name, email, password) => {
    let status = {}
    if (!emailREGEX.test(email)) status = {success: false, message: 'Invalid email!'}
    else {
        let hashed = await bcrypt.hash(password, 12)
        try {
            let buffer = new User({name, email, password: hashed})
            await buffer.save()
            buffer['password'] = ''
            status = {success: true, object: buffer}
        } catch (e) {
            console.log(e)
            status = {success: false, message: e.message()}
        }
    }

    return status
}

let getUsers = async () => await User.find()

let checkHash = async (_id, password) => {
    try {
        let requestedUser = await User.findOne({_id})
        let matched = await bcrypt.compare(password, requestedUser.password)
        if (matched)
            return {success: true, requestedUser}
        else return {success: false, message: 'Invalid password!'}
    } catch (e) {
        console.log(e)
        return {success: false, message: e.message()}
    }
}


module.exports = {
    createNewUser, getUsers, checkHash
}