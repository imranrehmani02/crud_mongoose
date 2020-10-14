//init code

const router = require('express').Router();
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {check, validationResult } = require('express-validator');  //check & validationResult values always same
const User = require('./../models/user');

//middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({secret:'secretcode123'}));


//router goes here
//default route
router.all('/',(req,res)=>
{
    return res.json({
        staus:true,
        message:'user controller working...'
    });
});

//ejs page routes
//sign_up page
router.get('/signup_page',(req,res)=>
{
    res.render('user_signup');
})

//login user
router.get('/login_page',(req,res)=>
{
    res.render('user_login');
})

//update page request
router.get('/update_req',(req,res)=>
{
    res.render('update',{username:req.query.username, email : req.query.email});
})


//update router
router.post('/user_signup',
[
    //check not empty fields

    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
],

function(req,res)
{
    //check validation error

    const errors= validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(422).json({
            status:false,
            message:'Form validation errors',
            errors:errors.array()
        })
    }

    //hash password

    const hashedPassword = bcryptjs.hashSync(req.body.password,10);

    //data save to database using create method
    User.create({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    },
    
    function(error,result)
    {
        //check error
        if(error)
        {
            return res.json({
                status:false,
                message:'DB Insert Failed',
                error:error
            })
        }

        //if everything ok

        return res.status(200).json({
            status : true,
            message: 'DB Insert Success',
            result : result
        })
    })


    // data save to database using save method
    //create new user model
    // var temp = new User({
    //     username : req.body.username,
    //     email : req.body.email,
    //     password : hashedPassword
    // });

    // //insert data into database
    // temp.save(function(error,result)
    // {
    //     //check error
    //     if(error)
    //     {
    //         return res.json({
    //             status:false,
    //             message : 'DB Insert failed..',
    //             error:error
    //         })
    //     }

    //     return res.json({
    //         status : true,
    //         message : 'DB insert successful',
    //         result : result
    //     })

    // })

})



//update user detail
router.post('/update',
function(req,res)
{

    User.update(
        { email : req.body.email },
        { username : req.body.username},

        function(error,result)
        {
            if(error)
            {
                res.send('Value not update');
            }
            else
            {
                console.log('Value Updated')
            }
            
        },
        
        res.redirect('/user/find')
    )
})


//delete user

router.get('/delete',(req,res)=>
{
    if(req.query.email)
    {
        User.deleteOne(
            { email : req.query.email},
            function(err,result)
        {
            if(err)
            {
                res.send('user not delete')
            }
            else
            {
                console.log('Value deleted')
            }
        })
        res.redirect('/user/find');
    }
})

//user login
router.post('/login',
[
    //check not empty fields
    check('email').isEmail().normalizeEmail(),
    check('password').not().isEmpty().trim().escape()
],
    function(req,res)
    {
        //check validations error
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(500).json({
                status:false,
                message:'Form Validation Error',
                errors : errors.array()
            })
        }

        //check email exists or not
        User.findOne(
            {email:req.body.email},
            function(error,result)
            {
                //check error
                if(error)
                {
                    return res.status(500).json({
                        status : false,
                        message : 'Email don\'t exist',
                        error:error
                    })
                }

                //result is empty or not

                if(result)
                {
                    //when result variable contains password
                    //match password

                    const isMatch = bcryptjs.compareSync(req.body.password, result.password);

                    //if password matched
                    if(isMatch)
                    {
                        //password matched
                       req.session.email = result.email
                       console.log('session : ',req.session.email)
                       res.redirect('/user/find');
                    }
                    else
                    {
                        return res.status(500).json({
                            status:false,
                            message:'password not match'
                        })
                    }
                }
                else
                {
                    return res.status(500).json({
                        status:false,
                        message:'User email don\'t exist'
                    })
                }
            }
        )
    }
)

//show user document route
router.get('/find',(req,res)=>
{
    if(req.session.email)
    {
    User.find(function(error,result)
    {
        //check error
        if(error)
        {
           res.render('show',{result :[], email:req.session.email})
        }

        else
        {
            res.render('show',{result:result, email:req.session.email})
        }
      
    })
    }

    else
    {
        res.redirect('/user/login_page')
    }
})

//user logout

router.get('/logout',(req,res)=>
{
    req.session.destroy(function()
    {
        console.log('user logged out');
    }),
    res.redirect('/user/login_page')
});
//module exports 
module.exports = router;