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
};

exports.getPostById = (req,res,next) => {
    const id = req.params.postId;

    Post.findOne({ _id: id })
    .then(post => {
        const author = post.userId;
        const currentUser = req.session.user._id.toString();
        //console.log(author === currentUser);
        res.render('post-details', {
            pageTitle: post.title,
            path: `/posts/${post._id}`,
            post: post,
            viewedByAuthor: author.toString() === currentUser.toString()
        });
    })
    .catch(err => console.log(err));
};

exports.getEditPost = (req,res,next) => {
    const id = req.params.postId;

    Post.findOne({ _id: id })
    .then(post => {
        res.render('edit-post', {
            pageTitle: 'Add post',
            path: '/edit-post',
            oldData: {
                title: post.title,
                text: post.text
            },
            post: post
        })
    })
};

exports.postEditPost = (req,res,next) => {
    const currentUser = req.user._id;
    const title = req.body.title;
    const text = req.body.text;
    const id = req.body.postId;

    Post.findOne({ _id: id })
    .then(post => {
        if (post.userId.toString() === currentUser.toString()) { // checking is user is author
            post.title = title;
            post.text = text;
            post.updatedAt = Date.now();

            post.save()
            .then(() => res.redirect(`/posts/${post._id}`))
            .catch(err => console.log(err));
        }
        else res.redirect('/my-posts'); // flash an error here
    })
    .catch(err => console.log(err));
};