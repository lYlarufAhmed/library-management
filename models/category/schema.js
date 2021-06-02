let mg = require("mongoose")

const CategorySchema = new mg.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = CategorySchema
