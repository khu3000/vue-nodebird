exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); //인수가 없을 경우 다음 middleware 로 진행
    }
    return res.status(401).send('로그인이 필요합니다');
}

exports.isNotLoggedIn = (req, res, next) => {
    return next();
    // if (!req.isAuthenticated()) {
    //     return next();
    // }
    // return res.status(401).send('로그인한 사용자는 이용할 수 없습니다');
}