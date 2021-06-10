const mg = require('mongoose')

let UserSchema = new mg.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePhotoUrl: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

const UserModel = new mg.model('User', UserSchema)

module.exports = UserModel