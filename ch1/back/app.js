const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const cookie = require('cookie-parser');

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

//db.sequelize.sync({force:true});
db.sequelize.sync();
passportConfig();
const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookie('cookiesecret'));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : 'cookiesecret',
    cookie : {
        httpOnly : true,
        sercure : false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=> {
    res.send('안녕 백엔드1');
});

app.use('/user', userRouter);
app.use('/post', postRouter);


app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
}) 