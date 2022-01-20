// init code

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;
const database = require('./database');
const userRouter = require('./routes/user.routes');

const app = express();

app.set('view engine', 'ejs');

//middleware setup
app.use(morgan('dev'));
app.use(cors());
app.use('/user', userRouter);
app.use(express.static(path.join(__dirname, 'assets')))

//defaults routes

app.all('/', (req, res) => {
    // return res.json({
    //     status:true,
    //     message:'app.js page working....'
    // });

    res.render('home');
    // res.send('App.js page working..');
});

//start server

app.listen(port, () => console.log('server running at port : ', port));