let mg = require("mongoose")
const Book = require("../book/schema");

const CategorySchema = new mg.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

CategorySchema.post('remove', function (next){
    Book.deleteMany({category: this._id}).exec()
})

let Category = new mg.model('Category', CategorySchema)
module.exports = Category
