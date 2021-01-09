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

        if(req.body.image) {
            if(Array.isArray(req.body.image)){
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({src:image, PostId : newPost.id});
                }))
            } else {
                await db.Image.create({src:image, PostId : newPost.id});
            }
        }

        const fullPost = await db.Post.findOne({
            where : {id:newPost.id},
            include:[{  //include : 모델에 정의한 테이블 조인하여 가져오기
                model : db.User,
                attributes : ['id', 'nickname'], //해당 컬럼만 가져오도록 함
            }, {
                model : db.Image,
            }],
        })

        return res.json(fullPost); 
    } catch (err) {
        console.error(err);
        next(err);
    }

});

router.put('/id');

router.delete('/:id', async(req, res, next) => {
    try{
        await db.Post.destroy({
            where : {
                id : req.params.id,
            }
        })
        res.send('삭제했습니다.');
    }catch(err){
        console.error(err);
    }
})

router.get('/:id/comments', async(req,res,next) => {
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where : {
                PostId : req.params.id,
            },
            include : [{
                model:db.User,
                attributes:['id', 'nickname'],
            }],
            order:[['createAt', 'ASC']], //주의 2차원 배열로 해야함, 2개 이상 조건 정렬 기준시 사용
        })
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/:id/comment', isLoggedIn, async (req,res,next) => {
    try {
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        const newComment = await db.Comment.create({
            PostId : post.id,
            UserId : req.user.id,
            content : req.body.content,
        });

        const comment = await db.Comment.findOne({
            where : {
                id: newComment.id,
            },
            include : [{
                model : db.User,
                attributes:['id', 'nickname']
            }]
        })

    } catch (err) {
        next(err);
    }
})

router.post('/:id/retweet', (req,res,next) =>{

});

module.exports = router;
