
const router = require('express').Router();
const bodyParser = require('body-parser');
const {check, validationResult } = require('express-validator'); 
const {signup, login, find, update, /**delete,*/ logout} = require('../controllers/user.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.all('/',(req,res)=>
{
    return res.status(200).json({
        staus:true,
        message:'user Router working...'
    })
})

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


//user router
//user signup
router.post('/user_signup',
[
    //check not empty fields
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
],signup)


//user login
router.post('/login',
[
    //check not empty fields
    check('email').isEmail().normalizeEmail(),
    check('password').not().isEmpty().trim().escape()
],login)


//show user document route
router.get('/find',find);


//update user detail
router.post('/update',update);

//delete user
//router.get('/delete',delete);

//logout user
router.get('/logout',logout);
    
//module exports 
module.exports = router;