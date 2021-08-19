const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const isAuth = require('../middleware/is-auth');
const { check } = require('express-validator/check');

router.get('/', mainController.getIndex);

router.get('/my-posts', isAuth,  mainController.getPostsByUserId);

router.get('/add-post', isAuth, mainController.getAddPost);

router.post('/add-post', isAuth, [
        check('title').isString().trim().isLength({ min: 2, max: 30 }).withMessage('Title must have from 2 to 30 characters'),
        check('text').isString().trim().isLength({ min: 5, max: 5000 }).withMessage('Text must have from 5 to 5000 characters')
    ], mainController.postAddPost);

router.get('/posts/:postId', isAuth, mainController.getPostById);

router.post('/posts/:postId', isAuth, mainController.toggleLikes);

router.get('/edit-post/:postId', isAuth, mainController.getEditPost);

router.post('/edit-post', isAuth, [
        check('title').isString().trim().isLength({ min: 2, max: 30 }).withMessage('Title must have from 2 to 30 characters'),
        check('text').isString().trim().isLength({ min: 5, max: 5000 }).withMessage('Text must have from 5 to 5000 characters')
    ], mainController.postEditPost);

router.post('/delete-post', isAuth, mainController.deletePost);

router.post('/add-comment/:postId', isAuth, mainController.addComment);

module.exports = router;