const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getIndex);

router.get('/my-posts', mainController.getPostsByUserId);

router.get('/add-post', mainController.getAddPost);

router.post('/add-post', mainController.postAddPost);

router.get('/posts/:postId', mainController.getPostById);

router.get('/edit-post/:postId', mainController.getEditPost);

router.post('/edit-post', mainController.postEditPost);

module.exports = router;