const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator/check');
const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('name', 'Name must have from 2 to 20 characters').isString().trim().isLength({ min: 2, max: 20 }),
    check('email').trim().isEmail().withMessage('Invalid email. Please check your input').custom((value, {req}) => {
        User.findOne({ email: value })
        .then(user => {
            if (user) {
                return Promise.reject();
            }
        })
        .catch(err => console.log(err))
    }).withMessage('This email is already registered'),
    check('password', 'Password must have from 5 to 20 characters').isString().trim().isLength({ min: 5, max: 20 })
], authController.postSignup);

router.get('/login', authController.getLogin);

router.post('/login', [   
    check('email', 'Invalid email. Please check your input').trim().isEmail(),
    check('password', 'Password must have from 5 to 20 characters').isString().trim().isLength({ min: 5, max: 20 })
], authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;