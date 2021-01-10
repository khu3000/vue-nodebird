const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', isNotLoggedIn, async (req, res, next) => {
    const user= req.user;
    return res.json(user);
})

router.post('/', async (req, res, next) => {
    try{
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            where:{
                email:req.body.email,
            }
        });

        if(exUser) { //이미 회원가입 되어있으면
            return res.status(403).json({
                errorCode: 1,
                message: '이미 회원가입 되어있습니다.'
            })
        };
        
        const newUser = await db.User.create({
            //where:{
                nickname:req.body.nickname,
                password:hash,
                email:req.body.email,
           // }
        });

        passport.authenticate('local', (err, user, info) => {
            if(err) {
                console.error(err);
                return next(err);
            }
    
            if(info){
                return res.status(401).send(info.reason);
            }
    
            return req.login(user, async (err) => {
                if(err){
                    console.error(err);
                    return next(err);
                }

                const fullUser = await db.User.findOne({
                    where:{id:user.id},
                    attributes: ['id', 'nickname'],
                    include : [{
                        model : db.User,
                        as : 'Followings',
                        attributes : ['id'],
                    },{
                        model : db.User,
                        as : 'Followers',
                        attributes : ['id'],
                    }],
                });
    
                return res.json(fullUser);
            });
    
        })(req, res, next);

    } catch (err) {
        console.log(err);
        next(err);
    }
   
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.reason);
        }

        return req.login(user, async (err) => {
            if(err){
                console.error(err);
                return next(err);
            }

            const fullUser = await db.User.findOne({
                where:{id:user.id},
                attributes: ['id', 'nickname'],
                include : [{
                    model : db.User,
                    as : 'Followings',
                    attributes : ['id'],
                },{
                    model : db.User,
                    as : 'Followers',
                    attributes : ['id'],
                }],
            });

            return res.json(fullUser);
        });

    })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
        req.session.destroy(); //로그아웃 선택사항
        return res.status(200).send('로그아웃 되었습니다');
    }
})

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        const me = await db.User.findOne({
            where : {id : req.params.id}
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        const me = await db.User.findOne({
            where : {id : req.body.id}
        });
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e) {
        console.error(e);
        next(e);
    }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try{
        await db.User.update({
            nickname:req.body.nickname,
        }, {
            where : {id:req.user.id},
        })

        res.send(req.body.nickname);

    }catch(e) {
        console.error(e);
        next(e);
    }    
});

module.exports = router;