var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/auth', function (req, res, next){
  var login = req.params('inputID');
  var password = req.params('inputPassword');

  console.log(login, password);
  console.log(req.body);

  if (login === 'rint' && password ==='1234') {
    res.cookie('auth', true);
    res.redirect('/');
  } else res.redirect('/auth');
});

module.exports = router;
