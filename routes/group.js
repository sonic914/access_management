var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var mysql_db_config = {
  host: '192.100.100.76',
  user: 'latte',
  password: 'latte',
  database: 'latte'
};

var mysql_connection;
function hanleDisconnect(){
  mysql_connection = mysql.createConnection(mysql_db_config);

  mysql_connection.connect(function(err){
    if(err){
      console.log('error when connection to db: ', err);
      setTimeout(hanleDisconnect, 2000)
    }
  });

  mysql_connection.on('error', function(err){
    console.log('mysql db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      hanleDisconnect();
    } else {
      throw err;
    }
  });
}
hanleDisconnect();

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

  mysql_connection.query('use latte;');

  var queryStr = 'select USER_GROUP, group_concat(SABUN_ID, \'_\', USER_NAME) USER_NAME ';
  queryStr += 'from UserInfo ';
  queryStr += 'where USER_GROUP != \'Goodbye\' and USER_GROUP is not null  and USER_USE_YN = \'Y\'';
  queryStr += 'GROUP BY USER_GROUP ';
  queryStr += 'ORDER BY USER_GROUP;';

  mysql_connection.query(queryStr, function(err, rows){

    //console.log(rows);
    res.render('group', { link: linkLogin, btn: btnLogin, data:rows} );

    if(err){
      console.log('--------error--------');
      console.log(err);
    }
  });

  //res.render('group', { link: linkLogin, btn: btnLogin, users:rows} );
});

module.exports = router;