const express = require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const mongoose = require('mongoose');

const User = require('./models/User');

const mainRoutes = require('./routes/mainRoutes');

const MONGODB_URI = 'mongodb+srv://svetlana:node-mongo21@cluster0.rkavg.mongodb.net/blog';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findOne({ _id: '6113964e653b494d96a97a85'})
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use(mainRoutes);


mongoose.connect(MONGODB_URI)
.then( () => {
    //console.log('server running');
    app.listen(3000);
})
.catch(err => console.log(err));