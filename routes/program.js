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

/*var data = [
        {id:1, programName:'pro1', programExp:'pro1입니다', formName:'form1', formExp:'form1입니다', funName:'fun1', funExp:'fun1입니다'},
        {id:2, programName:'pro1', programExp:'pro1입니다', formName:'form1', formExp:'form1입니다', funName:'fun2', funExp:'fun2입니다'},
        {id:3, programName:'pro1', programExp:'pro1입니다', formName:'form2', formExp:'form2입니다', funName:'fun3', funExp:'fun3입니다'},
        {id:4, programName:'pro2', programExp:'pro2입니다', formName:'form3', formExp:'form3입니다', funName:'fun4', funExp:'fun4입니다'},
        {id:5, programName:'pro2', programExp:'pro2입니다', formName:'form3', formExp:'form3입니다', funName:'fun5', funExp:'fun5입니다'},
        {id:6, programName:'pro3', programExp:'pro3입니다', formName:'form4', formExp:'form4입니다', funName:'fun6', funExp:'fun6입니다'},
        {id:7, programName:'pro3', programExp:'pro3입니다', formName:'form5', formExp:'form5입니다', funName:'fun7', funExp:'fun7입니다'},
        {id:8, programName:'pro4', programExp:'pro4입니다', formName:'form6', formExp:'form6입니다', funName:'fun8', funExp:'fun8입니다'}
    ];
*/
var data = [];

/* GET users listing. */
router.get('/', function (req, res, next) {
    sql.connect(config, function(err){
        var request = new sql.Request();
        request.stream = true;
        request.query('select * from prg_mng');

        request.on('row', function(row){
            console.log(row.pm_id);
            data.push({'pm_id':row.pm_id, 'pm_prg_name':row.pm_prg_name, 'pm_prg_exp':row.pm_prg_exp, 'pm_form_name':row.pm_form_name, 'pm_form_exp':row.pm_form_exp, 'pm_fun_name':row.pm_fun_name, 'pm_fun_exp':row.pm_fun_exp});
        });

        /*request.on('recordset', function(columns){
            console.log('----------------recordset-----------------');
            console.dir(columns[1][1].prg_id);
        });
        */

        request.on('error', function(err){
            console.log('----------------error-----------------');
            console.log(err) ;
        });

        request.on('done', function(returnValue){
            console.log(data);
            res.render('program', { title: 'Express' , data: data });
        });
    });
});

router.post('/edit', function(req, res, next){
    var inputData = req.body;

    if(inputData.mode == 'A'){
        if(inputData.gbn == 'prg'){
            data.push({'id':data.length+1, 'programName': inputData.prgName, 'programExp': inputData.prgExp});
        }
        else if(inputData.gbn == 'form'){
            data.push({
                'id':data.length+1,
                'programName': inputData.prgName,
                'programExp': inputData.prgExp,
                'formName': inputData.formName,
                'formExp': inputData.formExp
            });
        }
        else if(inputData.gbn == 'fun'){
            data.push({
                'id':data.length+1,
                'programName': inputData.prgName,
                'programExp': inputData.prgExp,
                'formName': inputData.formName,
                'formExp': inputData.formExp,
                'funName': inputData.funName,
                'funExp': inputData.funExp
            });
        }
    }
    else if(inputData.mode == 'U'){
        if(inputData.gbn == 'prg'){

        }
        else if(inputData.gbn == 'form'){

        }
        else if(inputData.gbn == 'fun'){

        }
    }
    res.render('program', {title:'Edddd', data:data });
});
module.exports = router;