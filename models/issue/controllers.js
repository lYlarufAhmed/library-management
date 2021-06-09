const Issue = require('./schema')
let createNewIssue = async (member, book) => {
    let buffer = new Issue({member, book})
    await buffer.save()
}
let deleteIssue = async (_id) => {
    await Issue.findOne({_id}, (err, issue) => {
        if (issue) issue.remove()
        if (err){
            console.log(err)
            throw Error('Error deleting Issue')
        }
    })
}

let closeIssue = async (_id) => {
    return await Issue.updateOne({_id}, {open: false})
}

let searchIssue = async (query = {}, by = '') => {
    switch (by) {
        case 'open':
            return await Issue.find({open: query}).populate('book', 'title').populate('member', 'name')
        case 'member':
            return await Issue.find({member: query})
        case 'book':
            return await Issue.find({book: query}).populate('member', 'name')
        default:
            return await Issue.find()
    }

}
let getAllIssuesWithBook = async () => {
    return await Issue.find().populate('book', 'title')
}


module.exports = {
    createNewIssue,
    deleteIssue,
    closeIssue,
    searchIssue,
    getAllIssuesWithBook,
}