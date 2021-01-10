const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () =>{

    passport.serializeUser((user, done)=>{
        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done)=>{
        try{
            const user = await db.User.findOne({
                where:{id},
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
            return done(null, user);
        } catch(err) {
            console.log(err);
            return done(err);
        }
    });
    local();
}