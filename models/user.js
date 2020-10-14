//init code

const mongoose = require('mongoose');

//userSchema

const userSchema = mongoose.Schema({
    username :{
        type:String,
        required:true
    },

    email :{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    isActive : {
        type:Boolean,
        default:true
    },

    createdOn :{
        type:Date,
        default:Date.now()
    }
});

//usermodel

mongoose.model('users',userSchema);    //collection name must be plural

//module exports

module.exports = mongoose.model('users');