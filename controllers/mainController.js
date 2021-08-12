const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator/check');

exports.getIndex = (req,res,next) => {
    Post.find()
        .then(posts => {
            res.render('index', {
                pageTitle: 'Home',
                path: '/',
                posts: posts
            })
        })
        .catch(err => next(new Error(err)));
};

exports.getPostsByUserId = (req,res,next) => {
    const userId = req.user._id;

    Post.find({ userId: userId })
        .then(posts => {
            res.render('my-posts', {
                pageTitle: 'My posts',
                path: '/my-posts',
                posts: posts
            })
        })
        .catch(err => next(new Error(err)));
};

exports.getAddPost = (req,res,next) => {
    res.render('add-post', {
        pageTitle: 'Add post',
        path: '/add-post',
        errorMessage: '', 
        oldData: {
            title: '',
            text: ''
        },
        validationErrors: []
    })
};

exports.postAddPost = (req,res,next) => {
    const userId = req.user._id;
    const title = req.body.title;
    const text = req.body.text;
    let author;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {       
        return res.status(422).render('add-post', {
          path: '/add-post',
          pageTitle: 'Add post',
          errorMessage: errors.array()[0].msg,
          oldData: {
            title, text
          },
          validationErrors: errors.array()
        });
    }

    User.findOne( { _id: userId })
    .then(user => {
        author = user.name;
        const post = new Post({ userId, title, text, author });

        return post.save()
    })
    .then(() => {
        res.redirect('/my-posts');
    })
    .catch(err => next(new Error(err)));
};

exports.getPostById = (req,res,next) => {
    const id = req.params.postId;

    Post.findOne({ _id: id })
    .then(post => {
        const authorId = post.userId;
        const currentUser = req.session.user ? req.session.user._id.toString() : null;
        
        res.render('post-details', {
            pageTitle: post.title,
            path: `/posts/${post._id}`,
            post: post,
            viewedByAuthor: req.session.user ? authorId.toString() === currentUser.toString() : false
        });
        
    })
    .catch(err => next(new Error(err)));
};

exports.getEditPost = (req,res,next) => {
    const id = req.params.postId;

    Post.findOne({ _id: id })
    .then(post => {
        res.render('edit-post', {
            pageTitle: 'Add post',
            path: '/edit-post',
            errorMessage: '',
            post: post,
            oldData: {
                title: post.title,
                text: post.text
            },
            validationErrors: []
        })
    })
};

exports.postEditPost = (req,res,next) => {
    const currentUser = req.user._id;
    const title = req.body.title;
    const text = req.body.text;
    const id = req.body.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {       
        return res.status(422).render('edit-post', {
          path: '/edit-post',
          pageTitle: 'Edit post',
          errorMessage: errors.array()[0].msg,
          oldData: {
            title, text
          },
          post: {
              title, text
          },
          validationErrors: errors.array()
        });
    }

    Post.findOne({ _id: id })
    .then(post => {
        if (post.userId.toString() === currentUser.toString()) { // checking is user is author
            post.title = title;
            post.text = text;
            post.updatedAt = Date.now();

            post.save()
            .then(() => res.redirect(`/posts/${post._id}`))
            .catch(err => next(new Error(err)));
        }
        else res.redirect('/my-posts'); 
    })
    .catch(err => next(new Error(err)));
};

exports.deletePost = (req,res,next) => {
    const id = req.body.postId;

    Post.deleteOne({ _id: id, userId: req.session.user._id})
    .then(() => res.redirect('/my-posts'))
    .catch(err => next(new Error(err)));
}