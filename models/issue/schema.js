const mg = require('mongoose')

const IssueSchema = new mg.Schema({
    member: {
        type: mg.SchemaTypes.ObjectId,
        required: true,
        ref: 'Member',
        index: true
    },
    book: {
        type: mg.SchemaTypes.ObjectId,
        required: true,
        ref: 'Book',
        index: true
    },
    open:{
        type: Boolean,
        default: true,
        index: true
    }
}, {timestamps: true})

let Issue = new mg.model('Issue', IssueSchema)
module.exports = Issue