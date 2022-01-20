//init code
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');  //check & validationResult values always same
const { replaceOne } = require('../models/user.model');
const User = require('../models/user.model');


//signup
exports.signup = async (req, res) => {
    try {
        //check validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form validation errors',
                errors: errors.array()
            })
        }

        //hash password
        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);

        //create new user model
        var temp = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //insert data into database
        await User.createuser(temp)
            .then((result) => {
                return res.status(200).json({
                    status: true,
                    message: 'DB Insert Success',
                    data: result
                })
            })
            .catch((error) => {
                return res.status(500).json({
                    status: false,
                    message: 'DB Insert Failed',
                    data: error
                })
            })
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'DB Insert Error',
            error: error
        })
    }
}


//user login
exports.login = async (req, res) => {
    try {
        //check validations error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({
                status: false,
                message: 'Form Validation Error',
                errors: errors.array()
            })
        }

        //check email exists or not
        await User.login(
            { email: req.body.email }
        )
            .then(result => {
                if (result) {
                    //when result variable contains password
                    //match password

                    const isMatch = bcryptjs.compareSync(req.body.password, result.password);

                    //if password matched
                    if (isMatch) {
                        //password matched
                        req.session.email = result.email
                        console.log('session : ', req.session.email)
                        res.redirect('/user/find');
                    }
                    else {
                        return res.status(500).json({
                            status: false,
                            message: 'password not match'
                        })
                    }

                }
                else {
                    return res.status(500).json({
                        status: false,
                        message: 'User email don\'t exist'
                    })
                }

            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: 'Email don\'t exist',
                    error: error
                })
            })
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'User Login failed',
            error: error
        })
    }
}


//show user document route
exports.find = async (req, res) => {
    try {
        if (req.session.email) {
            await User.find({ email: { $ne: req.session.email } },
                //await User.finduser(
                function (error, result) {
                    //check error
                    if (error) {
                        res.render('show', { result: [], email: req.session.email })
                    }

                    else {
                        res.render('show', { result: result, email: req.session.email })
                    }

                })
        }

        else {
            res.redirect('/user/login_page')
        }
    }
    catch
    {
        res.redirect('/user/login_page')
    }
}


//update user detail
exports.update = async (req, res) => {

    try {

        email = req.body.email,
            username = req.body.username,
            await User.updatedata(email, username)
                .then(result => {
                    console.log('Value Updated');
                    res.redirect('/user/find');
                })
                .catch(error => {
                    res.send('Value not update');
                })
    }
    catch (error) {
        res.send('Value not update');
    }
}


//delete user
exports.remove = async (req, res) => {
    try {
        if (req.query.email) {
            await User.deleteData(req.query.email)
                .then(result => {
                    console.log('value deleted');
                })
                .catch(error => {
                    res.send('user not delete')
                })
            res.redirect('/user/find');
        }
    }
    catch (error) {
        res.send('user not delete')
    }
}

//user logout
exports.logout = async (req, res) => {
    req.session.destroy(function () {
        console.log('user logged out');
    }),
        res.redirect('/user/login_page')
}

//change password
exports.changepassword = (req, res) => {

    var password = req.body.password;
    var newpassword = req.body.newpassword;
    var confirmpassword = req.body.confirmpassword;
    var email = req.session.email;

    console.log(req.session.email);
    console.log(password, " " + newpassword + " " + confirmpassword + " " + email)

    User.login(
        { email: email }
    )
        .then(result => {
            const isMatch = bcryptjs.compareSync(req.body.password, result.password);

            //if password matched
            if (isMatch) {
                if (newpassword == confirmpassword) {
                    const newHashedPssword = bcryptjs.hashSync(newpassword, 10);

                    var query = { email: email }
                    var data = { $set: { password: newHashedPssword } }
                    User.update(query, data)
                        .then(result => {
                            return res.status(200).json({
                                success: true,
                                message: 'password changed',
                                data: result
                            })
                        })
                        .catch(error => {
                            return res.status(500).json({
                                success: true,
                                message: 'password not change',
                                data: error
                            })
                        })
                }
                else {
                    return res.status(500).json({
                        status: false,
                        message: 'new password and confirm password not match'
                    })
                }
            }
            else {
                return res.status(500).json({
                    status: false,
                    message: 'password not match'
                })
            }
        })
}