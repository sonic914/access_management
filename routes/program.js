var express = require('express');
var router = express.Router();

var data = [
        {id:1, programName:'pro1', programExp:'pro1입니다', formName:'form1', formExp:'form1입니다', funName:'fun1', funExp:'fun1입니다'},
        {id:2, programName:'pro1', programExp:'pro1입니다', formName:'form1', formExp:'form1입니다', funName:'fun2', funExp:'fun2입니다'},
        {id:3, programName:'pro1', programExp:'pro1입니다', formName:'form2', formExp:'form2입니다', funName:'fun3', funExp:'fun3입니다'},
        {id:4, programName:'pro2', programExp:'pro2입니다', formName:'form3', formExp:'form3입니다', funName:'fun4', funExp:'fun4입니다'},
        {id:5, programName:'pro2', programExp:'pro2입니다', formName:'form3', formExp:'form3입니다', funName:'fun5', funExp:'fun5입니다'},
        {id:6, programName:'pro3', programExp:'pro3입니다', formName:'form4', formExp:'form4입니다', funName:'fun6', funExp:'fun6입니다'},
        {id:7, programName:'pro3', programExp:'pro3입니다', formName:'form5', formExp:'form5입니다', funName:'fun7', funExp:'fun7입니다'},
        {id:8, programName:'pro4', programExp:'pro4입니다', formName:'form6', formExp:'form6입니다', funName:'fun8', funExp:'fun8입니다'}
    ];

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('program', { title: 'Express' , data: data });
});

router.post('/add', function(req, res, next){
    var name = req.body.name;
    var exp = req.body.exp;
    var mode = req.body.mode;
    var gbn = req.body.gbn;

    if(mode == 'A'){
        if(gbn == 'prg'){
            data.push({'id':data.length+1, 'programName': name, 'programExp': exp});
        }
        else if(gbn == 'form'){
            data[1].push({'id':'2', 'formName': name, 'formExp': exp});
        }
        else if(gbn == 'fun'){
            data[1].push({'id':'2', 'funName': name, 'funExp': exp});
        }
    }
    res.render('program', {title:'Edddd', data:data });
});
module.exports = router;