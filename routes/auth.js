var express = require('express');
var sql = require('mssql');
var router = express.Router();

// db info
var config = {
  user: 'sa',
  password: '1q@',
  server: '192.168.35.201',
  database: 'pam',
  stream: true,
  option: {
    encrypt: true
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.clearCookie('auth','/');
  res.render('auth', { title: 'Express' });
});

/* POST home page */
router.post ('/', function(req, res, next) {
  sql.connect(config, function(err) {
    var id = req.param('inputID');
    var password = req.param('inputPassword');
    var isUser = false;
    console.log('ID  /  PASSWORD : ' + id + ' ' + password);

    var request = new sql.Request();
    request.stream = true;
    request.query('select um_id from usr_mng where um_id = \'' + id + '\' and um_pw = \'' + password + '\'');

    request.on('error', function (err) {
      console.log('----------------error_post-----------------');
      console.log(err);
      res.send({message:'fail'});
    });

    request.on('row', function(row){
      if(row.um_id == id){
        isUser = true;
      }
    });

    request.on('done', function (returnValue) {
      if(isUser){
        console.log ('로그인 성공');
        res.cookie('auth', true);
        res.redirect ('/program');
      }else{
        console.log ('로그인 실패');
        res.redirect ('/');
      }

    });
  });
});

module.exports = router;