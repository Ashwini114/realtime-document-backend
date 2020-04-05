const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name:{
        type : String,
        required: true
    },
    last_name:{
        type : String
    },
    image : {
        type : String
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    online : {
        type : Boolean,
        required : true,
        default : false
    }
},
{ timestamps : true}
)

module.exports = mongoose.model('Users',userSchema)