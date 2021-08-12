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

const MONGODB_URI = 'mongodb+srv://svetlana:node-mongo21@cluster0.rkavg.mongodb.net/blog';

const csrfProtection = csrf();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(session({ 
    secret: 'mySecretIsSafe', 
    resave: false, 
    saveUninitialized: false,
    store: storage
}));

app.use(csrfProtection);

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
        .catch(err => console.log(err));
    }  
});

//setting up data for every view to be rendered:
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(mainRoutes);
app.use(authRoutes);
app.use(errorController);

mongoose.connect(MONGODB_URI)
.then( () => {
    //console.log('server running');
    app.listen(3000);
})
.catch(err => console.log(err));