const Category = require('./schema')
let getAllCategories = async () => await Category.find()
let createNewCategory = async (name) => {
    let buffer = new Category({name})
    await buffer.save()
}
let deleteCategory = async (_id) => {
    await Category.findOne({_id}, function (err, cat){
        cat.remove()
    })
}

let getCategory = async (name) => {
    return await Category.findOne({name})
}

module.exports = {
    getAllCategories,
    createNewCategory,
    deleteCategory,
    getCategory
}
