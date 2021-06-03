let mg = require("mongoose")
const Issue = require("../issue/schema");

const BookSchema = new mg.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    authors: {
        name: [String],
        // required: true
    },
    category: {
        type: mg.SchemaTypes.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
    }
}, {timestamps: true})


BookSchema.post('remove', function (next){
    Issue.deleteMany({book: this._id}).exec()
})

let Book = new mg.model('Book', BookSchema)
module.exports = Book
