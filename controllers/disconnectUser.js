const User = require('../models/user')

exports.disconnect = (id) => {
    User.updateOne({ _id: id }, { $set: { online: false } })
    .then(result=>{
        return true
    })
    .catch(err=>{
        return false
    })
}