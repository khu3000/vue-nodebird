const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
        },
    }),
    limit: {
        fileSize : 20 * 1024 * 1024
    }    
});

router.post('/images', isLoggedIn, upload.array('image'),  (req, res) => {
    console.log(req.files);
    return res.json(req.files.map(v => v.filename));
});

router.post('/', isLoggedIn, async (req, res, next) => {
    try{
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content : req.body.content,
            UserId : req.user.id,
        });
        if(hashtags){
            const result = Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where : {name:tag.slice(1).toLowerCase()},
            })));
            await newPost.addHashtags((await result).map(r => r[0]));
            //db.sequelize.query('SELECT * FROM TABLE'); //쿼리 직접 입력 필요할 경우
        }
        const fullPost = await db.Post.findOne({
            where : {id:newPost.id},
            include:[{  //include : 모델에 정의한 테이블 조인하여 가져오기
                model : db.User,
                attributes : ['id', 'nickname'], //해당 컬럼만 가져오도록 함
            }],
        })

        return res.json(fullPost); 
    } catch (err) {
        console.error(err);
        next(err);
    }

});

module.exports = router;
