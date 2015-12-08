var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth', { title: 'Express' });
});

/* POST home page */
router.post ('/', function(req, res, next) {
  var id = req.param('inputID');
  var password = req.param('inputPassword');
  console.log('ID  /  PASSWORD : ' + id + ' ' + password);

  if (id === '333' && password === '444') {
    console.log ('로그인 성공');
    res.cookie('auth', true);
    res.redirect ('/');
  } else {
    console.log ('로그인 실패');
    res.redirect ('/');
  }
});

module.exports = router;