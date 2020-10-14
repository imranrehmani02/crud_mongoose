
//init code
require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;

//connection code

mongoose.connect(db_url,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    },
    function(error,link)
    {
        //check error
        assert.equal(error,null,'DB connection error');

        //ok

        console.log('DB connection success');
        //console.log(link);
    })