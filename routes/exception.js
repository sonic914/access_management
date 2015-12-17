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

    res.render('exception', {  link: linkLogin, btn: btnLogin  });
});

router.post('/getUserGroup', function (req, res) {
    var sabun = req.body.sabun;

    mysql_connection.query('use latte;');
    var myQueryStr = 'select USER_GROUP ';
    myQueryStr += 'from UserInfo ';
    myQueryStr += 'where sabun_id = \'' + sabun + '\'';

    mysql_connection.query(myQueryStr, function(err, rows){

        res.send({data:rows});

        if(err){
            console.log('--------mysql error--------');
            console.log(err);
        }
    });

});

router.post('/getForbiddenPrg', function (req, res) {
    sql.connect(config, function (err) {

        var userGroup = req.body.userGroup;

        var request = new sql.Request();
        request.stream = true;

        var data = [];
        var queryStr = '';
        queryStr = 'select pgm.pgm_seq, pm.pm_id, concat(pm.pm_prg_name,\'_\', pm_form_name, \'_\',pm.pm_fun_name) prg_name,';
        queryStr += ' concat(pm.pm_prg_exp,\'_\', pm_form_exp, \'_\',pm.pm_fun_exp) prg_exp';
        queryStr += '  from prg_grp_mng pgm, prg_mng pm';
        queryStr += ' where pgm.pgm_pm_id = pm.pm_id';
        queryStr += '   and pgm.pgm_user_group = \'' + userGroup + '\'';
        queryStr += '   and pgm.pgm_del_yn =\'N\'';
        queryStr += '   and pm.pm_del_yn =\'N\'';

        console.log('queryStr :: '+queryStr);
        request.query(queryStr);

        request.on('row', function (row) {
            data.push({pgm_seq:row.pgm_seq, pm_id:row.pm_id, prg_name:row.prg_name, prg_exp:row.prg_exp});
        });

        request.on('error', function (err) {
            console.log('----------------/getForbiddenPrg_error-----------------');
            console.log(err);
        });

        request.on('done', function (returnValue) {
            res.send({title: 'Express', data:data});
        });
        //sql.close();
    });
});

router.post('/saveExcUser', function (req, res) {
    sql.connect(config, function (err) {

        var inputData = req.body;

        var request = new sql.Request();
        request.stream = true;

        var queryStr = '';
        queryStr = 'insert into prg_user_mng (pum_pgm_seq, pum_sabun, pum_str_date, pum_end_date, pum_upt_id) values (';
        queryStr += inputData.pgmSeq + ', \'' + inputData.sabun +'\', \'' + inputData.startDate + '\', \'' + inputData.endDate + '\', \'admin\')';
        console.log(queryStr);
        request.query(queryStr);

        var data = [];
        request.on('row', function (row) {
            console.log(row);
        });

        request.on('error', function (err) {
            console.log('----------------error-----------------');
            console.log(err);
        });

        request.on('done', function (returnValue) {
            res.send();
        });
        //sql.close();
    });
});

router.post('/getExcUserPrg', function (req, res) {
    sql.connect(config, function (err) {

        var sabun = req.body.sabun;

        var request = new sql.Request();
        request.stream = true;

        var queryStr = '';
         queryStr += 'select pum.pum_seq, pm.pm_prg_name, pm.pm_prg_exp, pm.pm_form_name, pm.pm_form_exp,';
        queryStr += ' pm.pm_fun_name, pm.pm_fun_exp, pum.pum_str_date, pum.pum_end_date';
          queryStr += '  from prg_user_mng pum, prg_grp_mng pgm, prg_mng pm'; 
        queryStr += ' where pum.pum_sabun = \'' + sabun + '\''; 
        queryStr += '   and pum.pum_pgm_seq = pgm.pgm_seq'; 
        queryStr += '   and pgm.pgm_pm_id = pm.pm_id';
         queryStr += '   and pum.pum_del_yn = \'N\''; 
        queryStr += '   and pgm.pgm_del_yn = \'N\''; 
        queryStr += '   and pm.pm_del_yn = \'N\'';

        console.log('queryStr :: '+queryStr);
        request.query(queryStr);

        var data = [];

        request.on('row', function (row) {
            data.push({pum_seq:row.pum_seq, pm_prg_name:row.pm_prg_name, pm_prg_exp:row.pm_prg_exp
                , pm_form_name:row.pm_form_name, pm_form_exp:row.pm_form_exp, pm_fun_name:row.pm_fun_name, pm_fun_exp:row.pm_fun_exp
                , pum_str_date:row.pum_str_date, pum_end_date:row.pum_end_date});
        });

        request.on('error', function (err) {
            console.log('----------------error-----------------');
            console.log(err);
        });

        request.on('done', function (returnValue) {
            res.send({title: 'Express', data:data});
        });
        //sql.close();
    });
});

router.post('/delExcUserPrg', function (req, res) {
    sql.connect(config, function (err) {

        var pumSeq = req.body.pumSeq;

        var request = new sql.Request();
        request.stream = true;

        var queryStr = '';
        queryStr += 'update prg_user_mng set pum_del_yn = \'Y\' where pum_seq =' + pumSeq;
        console.log('queryStr :: '+queryStr);
        request.query(queryStr);

        request.on('row', function (row) {
        });

        request.on('error', function (err) {
            console.log('----------------error-----------------');
            console.log(err);
        });

        request.on('done', function (returnValue) {
            res.send();
        });
        //sql.close();
    });
});

module.exports = router;