const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const isAuth = require('../middleware/is-auth');

router.get('/', mainController.getIndex);

router.get('/my-posts', isAuth, mainController.getPostsByUserId);

router.get('/add-post', isAuth, mainController.getAddPost);

router.post('/add-post', isAuth, mainController.postAddPost);

router.get('/posts/:postId', isAuth, mainController.getPostById);

router.get('/edit-post/:postId', isAuth, mainController.getEditPost);

router.post('/edit-post', isAuth, mainController.postEditPost);

router.post('/delete-post', isAuth, mainController.deletePost);

module.exports = router;