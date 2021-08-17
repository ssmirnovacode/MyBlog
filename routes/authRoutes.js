const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator/check');
const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.post('/signup', [
        check('name', 'Name must have from 2 to 20 characters').isString().trim()
            .isLength({ min: 2, max: 20 }),
        check('email').trim().isEmail().withMessage('Invalid email. Please check your input')
            .custom((value, {req}) => {
                return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject();
                    }
                    else return true;
                })
                .catch(err => console.log(err))
            }).withMessage('This email is already registered'),
        check('imageUrl').trim().isURL().withMessage('Invalid URL. Please check your input'),
        check('password').isString().trim()
            .isLength({ min: 5, max: 20 }).withMessage('Password must have from 5 to 20 characters')
            .matches(/\d/).withMessage('Password must contain a number'),
        check('confirmPassword').trim().custom((value, {req}) => {
            if (req.body.password !== value) {
                return Promise.reject();
            }
            else return true;
        }).withMessage('Passwords do not match!')
    ], authController.postSignup);

router.get('/login', authController.getLogin);

router.post('/login', [   
        check('email').trim().isEmail().withMessage('Invalid email. Please check your input'),
        check('password').isString().trim().withMessage('Invalid password')
    ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/profile', authController.getProfile);

router.post('/edit-profile', [
    check('name', 'Name must have from 2 to 20 characters').isString().trim()
            .isLength({ min: 2, max: 20 }),
    check('email').trim().isEmail().withMessage('Invalid email. Please check your input')
    .custom((value, {req}) => {
        return User.findOne({ email: value })
        .then(user => {
            if (user && (user._id.toString() !== req.user._id.toString())) { // if email belongs to another user
                return Promise.reject();
            }
            else return true;
        })
        .catch(err => next(err))
    }).withMessage('This email is already registered for another user'),
    check('imageUrl').trim().isURL().withMessage('Invalid URL. Please check your input'),
    ], authController.editProfile);

router.post('/edit-password', [
    check('password').isString().trim()
        .isLength({ min: 5, max: 20 }).withMessage('Password must have from 5 to 20 characters')
        .matches(/\d/).withMessage('Password must contain a number'),
    check('confirmPassword').trim().custom((value, {req}) => {
        if (req.body.password !== value) {
            return Promise.reject();
        }
        else return true;
    }).withMessage('Passwords do not match!')
    ], authController.editPassword)

module.exports = router;