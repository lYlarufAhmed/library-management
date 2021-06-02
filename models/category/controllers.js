const mg = require('mongoose')
const CategorySchema = require('./schema')
let Category = new mg.model('Category', CategorySchema)
let getAllCategories = async () => await Category.find()
let createNewCategory = async (name) => {
    let buffer = new Category({name})
    await buffer.save()
}
let deleteCategory = async (name) => {
    let instance = await Category.findOne({name}, (err) => {
        return false
    })
    if (instance) {
        instance.remove()
        return true
    }
    return false
}

let getCategory = async (name)=>{
    let category = await Category.findOne({name})
    return category
}

module.exports = {
    getAllCategories,
    createNewCategory,
    deleteCategory,
    getCategory
}
