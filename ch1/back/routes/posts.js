const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try{
        let where = {};
        if(parseInt(req.query.lastId , 10)) {
            where = {
                id:{
                    [db.Sequelize.Op.lt] : parseInt(req.query.lastId , 10) //lt:미만, lte:이하, gt:초과,gte:이하, ne:불일치
                }
            }
        }
        const posts = await db.Post.findAll({
            where,
            include:[{
                model : db.User,
                attributes:['id', 'nickname'],
            },{
                model : db.Image,
            },{
                model : db.User,
                as : 'Likers',
                attributes : ['id'],
            },{
                model : db.Post,
                as : 'Retweet',
                include:[{
                    model : db.User,
                    attributes:['id', 'nickname'],
                }, {
                    model : db.Image,
                }]                
            }],
            order : [['createdAt', 'DESC']],
            limit : parseInt(req.query.limit, 10) || 10,
        })
        res.json(posts);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;