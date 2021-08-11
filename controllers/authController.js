const User = require('../models/User');

exports.getSignup = (req,res,next) => {
    res.render('signup', {
        pageTitle: 'Sign up',
        path: '/signup'
    })
};

exports.postSignup = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({ name, email, password });

    user.save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getLogin = (req,res,next) => {
    res.render('login', {
        pageTitle: 'Login',
        path: '/login'
    })
};

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            //add flash message
            res.redirect('/'); // change to rendering with old values
        }
        else {
            if (password !== user.password) {
                //add flash message
                res.redirect('/'); // change to rendering with old values
            }
            else {
                req.session.isLoggedIn = true;
                req.session.user = user; 
                req.session.save(err => { // to make sure the session was created before redirecting
                    console.log(err);
                    res.redirect('/my-posts');
                }); 
            }
        }
    })
};

exports.postLogout = (req,res,next) => {
    req.session.destroy( err => {
        console.log(err);
        res.redirect('/');
      });
}