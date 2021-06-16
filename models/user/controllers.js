let User = require('./schema')
let bcrypt = require('bcrypt')
const emailREGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

let createNewUser = async (name, email, password, path) => {
    let status = {}
    if (!emailREGEX.test(email)) status = {success: false, message: 'Invalid email!'}
    else {
        let hashed = await bcrypt.hash(password, 12)
        let profilePhotoUrl = path ? path:'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
        try {
            let buffer = new User({name, email, password: hashed, profilePhotoUrl})
            await buffer.save()
            buffer['password'] = ''
            status = {success: true, object: buffer}
        } catch (e) {
            console.log(e)
            status = {success: false, message: e.message}
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
        return {success: false, message: e.message}
    }
}
let findUserByEmail = async (email) => {
    try {
        return await User.findOne({email})
    } catch (e) {
        console.log(e)
        return {success: false, message: e.message}
    }
}

let logInUser = async (email, password) => {
    let searchedUser = await findUserByEmail(email)
    console.log(searchedUser)
    if (searchedUser) {
        let checkResult = await checkHash(searchedUser._id, password)
        if (checkResult) {
            searchedUser.password = ''
            return {success: true, loggedInUser: searchedUser}
        } else {
            return {success: false, message: 'email or password does not matched'}
        }
    } else {
        return {success: false, message: 'email or password does not matched'}
    }
}

module.exports = {
    createNewUser, getUsers, logInUser
}