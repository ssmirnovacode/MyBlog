const express = require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const mongoose = require('mongoose');

const app = express();

const MONGODB_URI = 'mongodb+srv://svetlana:node-mongo21@cluster0.rkavg.mongodb.net/blog';


mongoose.connect(MONGODB_URI)
.then( () => {
    console.log('server running');
    app.listen(3000);
})
.catch(err => console.log(err));