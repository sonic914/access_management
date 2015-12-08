var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var auth = req.cookies['auth'];
    var btnLogin = "";
    var linkLogin = "";

    if (auth) {
        btnLogin = '로그아웃';
        linkLogin = '/logout';
    } else {
        res.redirect('/');
    }

    res.render('program', { link: linkLogin, btn: btnLogin });
});

module.exports = router;