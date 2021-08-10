const express = require('express');

exports.getIndex = (req,res,next) => {
    res.render('index', {
        pageTitle: 'Home'
    })
}