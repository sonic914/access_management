var express = require('express');
var sql = require('mssql');
var mysql = require('mysql');
var router = express.Router();

// mssql db info
var config = {
  user: 'hpam_mng',
  password: 'halla1@',
  server: '192.100.100.133',
  database: 'HPAM',
  stream: true,
  option: {
    encrypt: true
  }
};

var mysql_connection = mysql.createConnection({
  host: '192.100.100.76',
  user: 'latte',
  password: 'latte'
});



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

    res.render('forbidden', { link: linkLogin, btn: btnLogin });
});


router.post('/getPrgName', function (req, res) {
  sql.connect(config, function(err) {

    var inputData = req.body.data;
    var data = [];
    var request = new sql.Request();
    request.stream = true;

    var queryStr = 'select pm_prg_name';
    queryStr +=    ' from prg_mng';
    queryStr +=    ' where pm_del_yn = \'N\'';
    queryStr +=    ' group by pm_prg_name';
    queryStr +=    ' order by pm_prg_name';
    request.query(queryStr);

    request.on('row', function(row){
      data.push({'pm_prg_name':row.pm_prg_name});
    });

    request.on('error', function(err){
      console.log('----------------error-----------------');
      console.log(err) ;
    });

    request.on('done', function(returnValue){
      res.send('forbidden', { title: 'Express' , data: data});
    });

    //sql.close();

  });
});

router.post('/getFormName', function (req, res) {
  sql.connect(config, function(err) {
    var inputData = req.body.prgName;
    var data = [];
    var request = new sql.Request();
    request.stream = true;

    var queryStr = 'select pm_form_name';
    queryStr +=    ' from prg_mng';
    queryStr +=    ' where pm_del_yn = \'N\'';
    queryStr +=    ' and pm_prg_name = \'' + inputData + '\'';
    queryStr +=    ' group by pm_form_name';
    queryStr +=    ' order by pm_form_name';

    request.query(queryStr);

    request.on('row', function(row){
      data.push({'pm_form_name':row.pm_form_name});
    });

    request.on('error', function(err){
      console.log('----------------error-----------------');
      console.log(err) ;
    });

    request.on('done', function(returnValue){
      res.send({ title: 'Express' , data: data});
    });

    //sql.close();

  });
});

router.post('/getFunName', function (req, res) {
  sql.connect(config, function (err) {
    var inputData1 = req.body.prgName;
    var inputData2 = req.body.formName;

    var data = [];
    var request = new sql.Request();
    request.stream = true;

    var queryStr = 'select pm_id, pm_fun_name';
    queryStr += ' from prg_mng';
    queryStr += ' where pm_del_yn = \'N\'';
    queryStr += ' and pm_prg_name = \'' + inputData1 + '\'';
    queryStr += ' and pm_form_name = \'' + inputData2 + '\'';
    queryStr += ' order by pm_fun_name';

    request.query(queryStr);

    request.on('row', function (row) {
      data.push({'pm_id': row.pm_id, 'pm_fun_name': row.pm_fun_name});
    });

    request.on('error', function (err) {
      console.log('----------------error-----------------');
      console.log(err);
    });

    request.on('done', function (returnValue) {
      res.send({title: 'Express', data: data});
    });
    //sql.close();
  });
});

router.post('/getAllGroups', function (req, res) {
  var groups = [];

  mysql_connection.query('use latte;');
  var myQueryStr = 'select USER_GROUP ';
  myQueryStr += 'from UserInfo ';
  myQueryStr += 'where USER_GROUP != \'Goodbye\' and USER_GROUP is not null ';
  myQueryStr += 'GROUP BY USER_GROUP ';
  myQueryStr += 'ORDER BY USER_GROUP;';

  mysql_connection.query(myQueryStr, function(err, rows){
    // user_group records
    groups = rows;

    if(err){
      console.log('--------mysql error--------');
      console.log(err);
    }
  });

  sql.connect(config, function (err) {
    var inputData1 = req.body.pmId;

    var data = [];
    var pgmSeqStr = '';

    var request = new sql.Request();
    request.stream = true;

    var queryStr = 'select pgm_seq, pgm_user_group';
    queryStr += ' from prg_grp_mng';
    queryStr += ' where pgm_del_yn = \'N\'';
    queryStr += ' and pgm_pm_id = \'' + inputData1 + '\'';

    request.query(queryStr);

    request.on('row', function (row) {
      data.push({'pgm_seq': row.pgm_seq, 'pgm_user_group': row.pgm_user_group});
      pgmSeqStr += 'row.pgm_seq' + ',';
    });

    request.on('error', function (err) {
      console.log('----------------error-----------------');
      console.log(err);
    });

    request.on('done', function (returnValue) {
      res.send({title: 'Express', data: data, groups: groups, pgmSeq:pgmSeqStr });
    });
    //sql.close();
  });
});

router.post('/edit', function (req, res, next) {
  sql.connect(config, function (err) {

    var pmId = req.body.pmId;
    var checkedG = req.body.checkedG;
    checkedG = checkedG.split(',');

    var request = new sql.Request();
    request.stream = true;

    var cnt = 0;
    var queryStr = '';
    // 기존의 프로그램에 제한 된 그룹들 전부 삭제로(pgm_del_yn = Y) 업데이트.
    queryStr = 'update prg_grp_mng set pgm_del_yn = \'Y\' where pgm_pm_id = ' + pmId;
    request.query(queryStr);

    queryStr = '';
    queryStr += ' insert into prg_grp_mng (pgm_pm_id, pgm_user_group, pgm_upt_id) values ';
    for(var i=0; i<checkedG.length; i++){
      if(i == checkedG.length-1){
        queryStr += ' (' + pmId + ', \'' + checkedG[i] + '\', \'admin\')';
      }else{
        queryStr += ' (' + pmId + ', \'' + checkedG[i] + '\', \'admin\'),';
      }
    }
    request.query(queryStr);

    request.on('row', function (row) {
      cnt++;
    });

    request.on('error', function (err) {
      console.log('----------------error-----------------');
      console.log(err);
    });

    request.on('done', function (returnValue) {
      // 쿼리를 두번 실행하므로, 처음 쿼리 실행 시 응답 보내지 않기 위해
      if(cnt == 2){
        res.send({title: 'Express', message:'success'});
      }
    });
    //sql.close();
  });
});


module.exports = router;