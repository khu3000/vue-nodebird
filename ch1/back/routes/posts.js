const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try{
        const posts = await db.Post.findAll({
            include:[{
                model : db.User,
                attributes:['id', 'nickname'],
            }],
            order : [['createdAt', 'DESC']],
            offset : req.query.offset,
            limit : req.query.limit,
        })
        res.json(posts);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;