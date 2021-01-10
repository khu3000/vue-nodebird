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
            },{
                model : db.User,
                as : 'Likers',
                attributes : ['id'],
            }],
        })

        return res.json(fullPost); 
    } catch (err) {
        console.error(err);
        next(err);
    }

});

router.put('/id');

router.delete('/:id', async (req, res, next) => {
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

router.get('/:id/comments', async (req,res,next) => {
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
        console.error(err);
        next(err);
    }
})

router.post('/:id/retweet', isLoggedIn, async (req,res,next) => {
    try{
        const post = await db.Post.findOne({
            where : {id:req.params.id},
            include : [{
                model: db.Post,
                as : 'Retweet', //리트윗한 게시글이면 원본 게시글이 됨
            }]
        });

        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        if(req.user.id === post.UserId || post.Retweet && post.Retweet.UserId == req.user.id){
            return res.status(404).send('자신의 글은 리트윗 할 수 없습니다');
        }

        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where : {
                UserId : req.user.id,
                RetweetId : retweetTargetId,
            },
        });
        if(exPost){
            return res.status(403).send('이미 리트윗했습니다');
        }

        const retweet = await db.Post.create({
            UserId : req.user.id,
            RetweetId : retweetTargetId,
            content : 'retweet',
        })

        const retweetWithPrevPost = await db.Post.findOne({
            where : {id:retweet.id},
            include : [{
                model: db.User,
                attributes : ['id', 'nickname'],
            }, {
                model : db.User,
                as : 'Likers',
                attributes : ['id'],
            },{
                model : db.Post,
                as : 'Retweet',
                include : [{
                    model : db.User,
                    attributes : ['id', 'nickname'],
                }, {
                    model: db.Image,
                }],
            }],
        });

        res.json(retweetWithPrevPost);
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/:id/like', isLoggedIn, async(req,res,next) => {
    try{
        const post = await db.Post.findOne({ where :{id:req.params.id}}) ;
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        await post.addLiker(req.user.id);
        res.json({userId : req.user.id});
    }catch(err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/like', isLoggedIn, async(req,res,next) => {
    try{
        const post = await db.Post.findOne({ where :{id:req.params.id}}) ;
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        await post.removeLiker(req.user.id);
        res.json({userId : req.user.id});
    }catch(err) {
        console.error(err);
        next(err);
    }
});
module.exports = router;
