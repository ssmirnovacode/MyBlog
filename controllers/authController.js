const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.getSignup = (req,res,next) => {
    res.render('signup', {
        pageTitle: 'Sign up',
        path: '/signup',
        errorMessage: '', 
        oldValues: {
            name: '',
            email: '', 
            password: '',
            confirmPassword: ''
        }
    })
};

exports.postSignup = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {       
        return res.status(422).render('signup', {
          path: '/signup',
          pageTitle: 'Sign up',
          errorMessage: errors.array()[0].msg,
          oldValues: {
            name, email, password, confirmPassword
          }
        });
      }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({ name, email, password: hashedPassword });
        return user.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getLogin = (req,res,next) => {
    res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: '', 
        oldValues: {
            email: '', 
            password: ''
        }
    })
};

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {       
        return res.status(422).render('login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: errors.array()[0].msg, 
          oldValues: {
            email, password
          }
        });
      }
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            res.status(422).render('login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'No user found for this email', 
                oldValues: {
                  email, password
                }
              });
        }
        else {
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user; 
                    req.session.save(err => { // to make sure the session was created before redirecting
                        console.log(err);
                        res.redirect('/my-posts');
                    }); 
                }
                else {
                    res.status(422).render('login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Incorrect password', 
                        oldValues: {
                          email, password
                        }
                      });
                }
            })
            .catch(err => console.log(err)); 
        }
    })  
    .catch(err => console.log(err)); 
};

exports.postLogout = (req,res,next) => {
    req.session.destroy( err => {
        console.log(err);
        res.redirect('/');
      });
}