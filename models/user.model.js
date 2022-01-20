
//init code
const mongoose = require('mongoose');
const db = require('../database');

//userSchema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdOn: {
        type: Date,
        default: Date.now()
    }
});

userSchema.statics.createuser = function (data) {
    return new Promise((resolve, reject) => {
        db.collection('users').insertOne(data, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
}

//  LOGIN USER
userSchema.statics.login = function (data) {
    return new Promise((resolve, reject) => {
        db.collection('users').findOne(data, (error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        })
    })
}

//   EMPLOYEE DATA
userSchema.statics.finduser = function () {
    return new Promise(function (resolve, reject) {
        db.collection('users').find().toArray(
            (error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            }
        )
    })
}

//   UPDATE EMPLOYEE DATA
userSchema.statics.updatedata = function (email, username) {
    return new Promise(function (resolve, reject) {
        query = { email: email };
        data = { $set: { username: username } };
        db.collection('users').updateOne(query, data,
            (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            }
        )
    })
}

// DELETE DATA

userSchema.statics.deleteData = function (email) {
    return new Promise(function (resolve, reject) {
        var data = { email: email }
        db.collection('users').deleteOne(data,
            (error, result) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
}

//usermodel
//mongoose.model('users',userSchema);    //collection name must be plural

//module exports
module.exports = mongoose.model('users', userSchema);