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
        },
        validationErrors: []
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
          },
          validationErrors: errors.array()
        });
      }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({ name, email, password: hashedPassword });
        return user.save()
    })
    .then(() => res.redirect('/login'))
    .catch(err => next(new Error(err)));
};

exports.getLogin = (req,res,next) => {
    res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: '', 
        oldValues: {
            email: '', 
            password: ''
        },
        validationErrors: []
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
        },
        validationErrors: errors.array()
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
                },
                validationErrors: [{ param: 'email'}]
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
                        },
                        validationErrors: [{ param: 'password'}]
                      });
                }
            })
            .catch(err => next(new Error(err))); 
        }
    })  
    .catch(err => next(new Error(err))); 
};

exports.postLogout = (req,res,next) => {
    req.session.destroy( err => {
        console.log(err);
        res.redirect('/');
      });
};

exports.getProfile = (req,res,next) => {
  User.findOne({ _id : req.user._id })
  .then(user => {
    res.render('profile', {
    path: '/profile',
    pageTitle: 'Profile',
    errorMessage: '',
    successMessage: '', 
    oldValues: {
      name: user.name, 
      email: user.email, 
      currentPassword: '', 
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
    })
  })
  .catch(err => next(err));
}

exports.editProfile = (req,res,next) => {
  const name = req.body.name;
  const email = req.body.email;
  const currentPassword = req.body.currentPassword;

  const errors = validationResult(req);
    if (!errors.isEmpty()) {       
        return res.status(422).render('profile', {
          path: '/profile',
          pageTitle: 'Profile',
          errorMessage: errors.array()[0].msg,
          successMessage: '',
          oldValues: {
            name, email, currentPassword: '', 
            password: '',
            confirmPassword: ''
          },
          validationErrors: errors.array()
        });
      }

  User.findOne({ _id: req.user._id })
  .then(user => {
    bcrypt.compare(currentPassword, user.password)
      .then(isMatch => {
        if (!isMatch) {
          res.status(422).render('profile', {
            path: '/profile',
            pageTitle: 'Profile',
            errorMessage: 'Incorrect password',
            successMessage: '', 
            oldValues: {
              name: name, 
              email: email, 
              currentPassword: '', 
              password: '',
              confirmPassword: ''
            },
            validationErrors: []
          })
        }
        else {
          user.name = name;
          user.email = email;
          user.save()
          .then(() => {
            res.status(200).render('profile', {
              path: '/profile',
              pageTitle: 'Profile',
              errorMessage: '',
              successMessage: 'Profile updated successfully', 
              oldValues: {
                name: user.name, 
                email: user.email, 
                currentPassword: '', 
                password: '',
                confirmPassword: ''
              },
              validationErrors: []
            })
          })
          .catch(err => next(err))
        }
      })
      .catch(err => next(err))
  })
  .catch(err => next(err))
};

exports.editPassword = (req,res,next) => {
  const currentPassword = req.body.currentPassword;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {   
    console.log(errors.array());    
      return res.status(422).render('profile', {
        path: '/profile',
        pageTitle: 'Profile',
        errorMessage: errors.array()[0].msg,
        successMessage: '',
        oldValues: {
          name: req.user.name,
          email: req.user.email,
          currentPassword: '', 
          password: '',
          confirmPassword: ''
        },
        validationErrors: errors.array()
      });
  }

  User.findOne({ _id: req.user._id })
    .then(user => {
      bcrypt.compare(currentPassword, user.password)
        .then(isMatch => {
          if (!isMatch) {
            res.status(422).render('profile', {
              path: '/profile',
              pageTitle: 'Profile',
              errorMessage: 'Incorrect password',
              successMessage: '', 
              oldValues: {
                name: user.name, 
                email: user.email, 
                currentPassword: '', 
                password,
                confirmPassword
              },
              validationErrors: []
            })
          }
          else {
            bcrypt.hash(password, 12)
            .then(hashedPassword => {
              user.password = hashedPassword;
              user.save()
              .then(() => {
                res.status(200).render('profile', {
                  path: '/profile',
                  pageTitle: 'Profile',
                  errorMessage: '',
                  successMessage: 'Password updated successfully', 
                  oldValues: {
                    name: user.name, 
                    email: user.email, 
                    currentPassword: '', 
                    password: '',
                    confirmPassword: ''
                  },
                  validationErrors: []
                })
              })
            })
          }
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
}