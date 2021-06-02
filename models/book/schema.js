
let mg = require("mongoose")

const BookSchema = new mg.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    authors:{
        name: [String],
        // required: true
    },
    category:{
        type: mg.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    price:{
        type: Number,
        required: true
    }
},{timestamps: true})

module.exports = BookSchema
