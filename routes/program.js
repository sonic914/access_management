var express = require('express');
var sql = require('mssql');
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
}

/* GET users listing. */
router.get('/', function (req, res) {
    sql.connect(config, function(err){
        var auth = req.cookies['auth'];
        var btnLogin = "";
        var linkLogin = "";

        if (auth) {
            btnLogin = '로그아웃';
            linkLogin = '/logout';
        } else {
            res.redirect('/');
        }

        var data = [];
        var request = new sql.Request();
        request.stream = true;

        var queryStr = 'select * from prg_mng where pm_del_yn = \'N\' order by pm_prg_name, pm_form_name, pm_fun_name';
        request.query(queryStr);

        request.on('row', function(row){
            data.push({'pm_id':row.pm_id, 'pm_prg_name':row.pm_prg_name, 'pm_prg_exp':row.pm_prg_exp, 'pm_form_name':row.pm_form_name, 'pm_form_exp':row.pm_form_exp, 'pm_fun_name':row.pm_fun_name, 'pm_fun_exp':row.pm_fun_exp});
        });


        /*request.on('recordset', function(columns){
            console.log('----------------recordset-----------------');
            console.dir(columns);
        });
        */

        request.on('error', function(err){
            console.log('----------------error-----------------');
            console.log(err) ;
        });

        request.on('done', function(returnValue){
            res.render('program', { title: 'Express' , data: data, link: linkLogin, btn: btnLogin });
        });

        //sql.close();
    //res.render('program', { title: 'Express' , data: data, link: linkLogin, btn: btnLogin });
    });
});

router.post('/edit', function(req, res){
    var auth = req.cookies['auth'];
    var btnLogin = "";
    var linkLogin = "";

    if (auth) {
        btnLogin = '로그아웃';
        linkLogin = '/logout';
    } else {
        res.redirect('/');
    }

    var inputData = req.body;
    var queryStr = '';
    // 추가
    if(inputData.mode == 'A'){
        if(inputData.gbn == 'prg'){
            queryStr = 'insert into prg_mng ';
            queryStr += '(pm_prg_name, pm_prg_exp, pm_upt_dt, pm_upt_id) ';
            // ###### hyelim -> 로그인한 id로 변경
            queryStr += 'values (\'' + inputData.prgName + '\', \'' + inputData.prgExp + '\', getDate(), \'admin\')';
        }
        else if(inputData.gbn == 'form'){
            // form과 function은 추가 시 두가지 경우가 있음
            // id가 있는 경우 : 프로그램만 등록 되어 있는 경우 -> update
            // id가 없는 경우  -> insert

            if(inputData.id == undefined){
                // id가 없는 경우
                queryStr = 'insert into prg_mng ';
                queryStr += '(pm_prg_name, pm_prg_exp, pm_form_name, pm_form_exp, pm_upt_dt, pm_upt_id) ';
                // ###### hyelim -> 로그인한 id로 변경
                queryStr += 'values (\'' + inputData.prgName + '\', \'' + inputData.prgExp + '\', \'' + inputData.formName + '\', \'' + inputData.formExp + '\', getDate(), \'admin\')';

            } else{
                // id가 있는 경우
                queryStr = 'update prg_mng set ';
                queryStr += 'pm_prg_name = \'' + inputData.prgName + '\', ';
                queryStr += 'pm_prg_exp = \'' + inputData.prgExp + '\', ';
                queryStr += 'pm_form_name = \'' + inputData.formName + '\', ';
                queryStr += 'pm_form_exp = \'' + inputData.formExp + '\', ';
                queryStr += 'pm_upt_dt = getDate(), ';
                queryStr += 'pm_upt_id = \'admin\' ';
                queryStr += 'where pm_id = ' + inputData.id;
            }
        }
        else if(inputData.gbn == 'fun'){
            if(inputData.id == undefined){
                // id가 없는 경우
                queryStr = 'insert into prg_mng ';
                queryStr += '(pm_prg_name, pm_prg_exp, pm_form_name, pm_form_exp, pm_fun_name, pm_fun_exp, pm_upt_dt, pm_upt_id) ';
                // ###### hyelim -> 로그인한 id로 변경
                queryStr += 'values (\'' + inputData.prgName + '\', \'' + inputData.prgExp + '\', \''
                    + inputData.formName + '\', \'' + inputData.formExp + '\', \''
                    + inputData.funName + '\', \'' + inputData.funExp + '\', getDate(), \'admin\')';

            } else {
                // id가 있는 경우
                queryStr = 'update prg_mng set ';
                queryStr += 'pm_prg_name = \'' + inputData.prgName + '\', ';
                queryStr += 'pm_prg_exp = \'' + inputData.prgExp + '\', ';
                queryStr += 'pm_form_name = \'' + inputData.formName + '\', ';
                queryStr += 'pm_form_exp = \'' + inputData.formExp + '\', ';
                queryStr += 'pm_fun_name = \'' + inputData.funName + '\', ';
                queryStr += 'pm_fun_exp = \'' + inputData.funExp + '\', ';
                queryStr += 'pm_upt_dt = getDate(), ';
                queryStr += 'pm_upt_id = \'admin\' ';
                queryStr += 'where pm_id = ' + inputData.id;
            }
        }
    }
    // 수정
    else if(inputData.mode == 'U'){
        if(inputData.gbn == 'prg'){
            queryStr = 'update prg_mng set ';
            queryStr += 'pm_prg_name = \'' + inputData.prgName + '\', ';
            queryStr += 'pm_prg_exp = \'' + inputData.prgExp + '\', ';
            queryStr += 'pm_upt_dt = getDate(), ';
            queryStr += 'pm_upt_id = \'admin\' ';
            queryStr += 'where pm_prg_name = \'' + inputData.oldName + '\' ';
            queryStr += 'and pm_prg_exp = \'' + inputData.oldExp + '\' ';
        }
        else if(inputData.gbn == 'form'){
            queryStr = 'update prg_mng set ';
            queryStr += 'pm_form_name = \'' + inputData.formName + '\', ';
            queryStr += 'pm_form_exp = \'' + inputData.formExp + '\', ';
            queryStr += 'pm_upt_dt = getDate(), ';
            queryStr += 'pm_upt_id = \'admin\' ';
            queryStr += 'where pm_prg_name = \'' + inputData.prgName + '\' ';
            queryStr += 'and pm_form_name = \'' + inputData.oldName + '\' ';
        }
        else if(inputData.gbn == 'fun'){
            queryStr = 'update prg_mng set ';
            queryStr += 'pm_fun_name = \'' + inputData.funName + '\', ';
            queryStr += 'pm_fun_exp = \'' + inputData.funExp + '\', ';
            queryStr += 'pm_upt_dt = getDate(), ';
            queryStr += 'pm_upt_id = \'admin\' ';
            queryStr += 'where pm_id = ' + inputData.id;
        }
    }

    // 삭제
    else if(inputData.mode == 'D'){
        queryStr = 'update prg_mng set ';
        queryStr += 'pm_del_yn = \'Y\', ';
        queryStr += 'pm_upt_dt = getDate(), ';
        queryStr += 'pm_upt_id = \'admin\' ';

        if(inputData.gbn == 'prg'){
            queryStr += 'where pm_prg_name = \'' + inputData.prgName + '\' ';
            queryStr += 'and pm_prg_exp = \'' + inputData.prgExp + '\' ';
        }
        else if(inputData.gbn == 'form'){
            queryStr += 'where pm_prg_name = \'' + inputData.prgName + '\' ';
            queryStr += 'and pm_form_name = \'' + inputData.formName + '\' ';
        }
        else if(inputData.gbn == 'fun'){
            queryStr += 'where pm_id = ' + inputData.id ;
        }
    }

    sql.connect(config, function(err) {
        //var data = [];
        var request = new sql.Request();
        request.stream = true;

        console.log('queryStr :: ' + queryStr);
        request.query(queryStr);


        //var request = new sql.Request();
        //var queryStr = 'select * from prg_mng order by pm_prg_name, pm_form_name, pm_fun_name';
        //request.query(queryStr);

        //request.on('row', function(row){
            //data.push({'pm_id':row.pm_id, 'pm_prg_name':row.pm_prg_name, 'pm_prg_exp':row.pm_prg_exp, 'pm_form_name':row.pm_form_name, 'pm_form_exp':row.pm_form_exp, 'pm_fun_name':row.pm_fun_name, 'pm_fun_exp':row.pm_fun_exp});
        //});


        /*request.on('recordset', function(columns){
         console.log('----------------recordset-----------------');
         console.dir(columns);
         });
         */

        request.on('error', function (err) {
            console.log('----------------error_post-----------------');
            console.log(err);
            res.redirect('/');
        });

        request.on('done', function (returnValue) {
            res.send({message:'success', link: linkLogin, btn: btnLogin});
            //res.render('program', {title: 'Express', message: 'success'});
        });

        //sql.close();
    });
});

module.exports = router;