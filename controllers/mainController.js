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
    const userId = req.params.userId;

    Post.findOne({ userId: userId })
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