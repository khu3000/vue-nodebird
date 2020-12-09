const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res)=> {
    res.send('안녕 백엔드1');
});

app.post('/user', (req, res) =>{
    req.body.nickname,
    req.body.password,
    req.body.email,
});

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
}) 