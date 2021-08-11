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