const express = require('express');
const Post = require('../models/Post');

exports.getIndex = (req,res,next) => {
    Post.find()
        .then(posts => {
            res.render('index', {
                pageTitle: 'Home',
                posts: posts
            })
        })
        .catch(err => console.log(err));
};

exports.getPosts = (req,res,next) => {
    
}