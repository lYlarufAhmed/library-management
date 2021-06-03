const mg = require('mongoose')
const MemberSchema = require('./schema')
let Member = new mg.model('Member', MemberSchema)
let getAllMembers = async () => await Member.find()
let createNewMember = async (name) => {
    let buffer = new Member({name})
    await buffer.save()
}
let deleteMember = async (memberId) => {
    await Member.findOne({memberId}, (err, member) => {
        if (member) member.remove()
        if (err) {
            console.log(err)
            throw Error('error deleting the member')
        }
    })

}

let getMember = async (memberId) => {
    return await Member.findOne({memberId})
}


let searchMember = async (name) => {
    return await Member.find({name: {$regex: name, $options: 'i'}})
}

let getAllUnissuedMembers = async (ids) =>{
    return await Member.find({_id: {$nin: ids}})
}

module.exports = {
    getAllMembers,
    createNewMember,
    deleteMember,
    getMember,
    searchMember,
    getAllUnissuedMembers
}