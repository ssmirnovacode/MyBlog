const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

module.exports = router;