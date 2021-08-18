const express = require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const User = require('./models/User');

const mainRoutes = require('./routes/mainRoutes');
const authRoutes = require('./routes/authRoutes');

const errorController = require('./controllers/errorController');

//const MONGODB_URI =  require('./config').mongo_uri;

const csrfProtection = csrf();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = new MongoDBStore({
    uri: process.env.MONGODB_URI, //MONGODB_URI
    collection: 'sessions'
});

app.use(session({ 
    secret: 'mySecretIsSafe', //require('./config').session_secret, 
    resave: false, 
    saveUninitialized: false,
    store: storage
}));

app.use(csrfProtection);
//setting up data for every view to be rendered:
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req,res,next) => {
    if (!req.session.user) {
        next();
    }
    else {
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => next(new Error(err)));
    }  
});

app.use(mainRoutes);
app.use(authRoutes);
app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.redirect('/500');
})

//const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI /* || MONGODB_URI */)
.then( () => {
    //console.log('server running');
    app.listen(process.env.PORT);
})
.catch(err => console.log(err));