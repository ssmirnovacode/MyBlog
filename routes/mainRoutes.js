const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getIndex);

router.get('/my-posts', mainController.getPostsByUserId);

router.get('/add-post', mainController.getAddPost);

module.exports = router;