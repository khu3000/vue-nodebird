const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');

const router = express.Router();

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
    
            return req.login(user, (err) => {
                if(err){
                    console.error(err);
                    return next(err);
                }
    
                return res.json(user);
            });
    
        })(req, res, next);

    } catch (err) {
        console.log(err);
        next(err);
    }
   
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.reason);
        }

        return req.login(user, (err) => {
            if(err){
                console.error(err);
                return next(err);
            }

            return res.json(user);
        });

    })(req, res, next);
});

router.post('/logout', (req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
        req.session.destroy(); //로그아웃 선택사항
        return res.status(200).send('로그아웃 되었습니다');
    }
})

module.exports = router;