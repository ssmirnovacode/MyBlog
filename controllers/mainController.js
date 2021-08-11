const express = require('express');
const Post = require('../models/Post');

exports.getIndex = (req,res,next) => {
    Post.find()
        .then(posts => {
            res.render('index', {
                pageTitle: 'Home',
                path: '/',
                posts: posts
            })
        })
        .catch(err => console.log(err));
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
        .catch(err => console.log(err));
};

exports.getAddPost = (req,res,next) => {
    res.render('add-post', {
        pageTitle: 'Add post',
        path: '/add-post'
    })
};

exports.postAddPost = (req,res,next) => {
    const userId = req.user._id;
    const title = req.body.title;
    const text = req.body.text;

    const post = new Post({ userId, title, text });

    post.save()
    .then(() => {
        res.redirect('/my-posts');
    })
    .catch(err => console.log(err));
}