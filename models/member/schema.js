const mg = require('mongoose')
const Issue = require("../issue/schema");

const MemberSchema = new mg.Schema({
    name: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        default: Date.now,
        index: true
    }
}, {timestamps: true})

MemberSchema.post('remove', function (next) {
    Issue.deleteMany({member: this._id}).exec()
})
module.exports = MemberSchema