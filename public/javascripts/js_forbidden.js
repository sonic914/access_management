/**
 * 권한관리 화면 script
 */
$(document).ready(function () {
    //var prgSelect = $('select[name=\'programSelect\']');
    getPrgSelectOption();

    $('button').click(function(){
        var checkedG = '';
        $('div div div input[type=checkbox]:checked').each(function(){

            checkedG += $(this).val() + ',';
        });
        checkedG = checkedG.substring(0, checkedG.length-1);

        var pmId = $('#funSelect').val();
        if(pmId == '' || pmId == undefined){
            alert('프로그램에 기능이 없습니다. 기능 추가 후 사용하십시오');
            return false;
        }

        $.ajax({
            url: '/forbidden/edit',
            type: 'post',
            data: {pmId:pmId, checkedG:checkedG},
            success: function (data) {
                location.reload();
            }
        });
    });
});

function getPrgSelectOption(obj){

    $.ajax({
        url: '/forbidden/getPrgName',
        type: 'post',
        success: function (data) {
            var option = '';
            for(var i= 0; i < data.data.length; i++ ){
                option += '<option>' + data.data[i].pm_prg_name + '</option>';
            }
            $('#programSelect option').remove();
            $('#programSelect').append(option);
            $('#programSelect option:first').attr('selected');

            getFormSelectOption();
        }
    });
}

function getFormSelectOption(obj){
    var prgName = $('#programSelect').val();
    $.ajax({
        url: '/forbidden/getFormName',
        type: 'post',
        data: {'prgName':prgName},
        success: function (data) {
            var option = '';
            for(var i= 0; i < data.data.length; i++ ){
                option += '<option>' + data.data[i].pm_form_name + '</option>';
            }
            $('#formSelect option').remove();
            $('#formSelect').append(option);
            $('#formSelect option:first').attr('selected');

            getFunSelectOption();
        }
    });
}

function getFunSelectOption(obj){
    var prgName = $('#programSelect').val();
    var formName = $('#formSelect').val();

    $.ajax({
        url: '/forbidden/getFunName',
        type: 'post',
        data: {'prgName':prgName, 'formName':formName},
        success: function (data) {
            var option = '';
            for(var i= 0; i < data.data.length; i++ ){
                option += '<option value=\''+ data.data[i].pm_id +'\'>' + data.data[i].pm_fun_name + '</option>';
            }
            $('#funSelect option').remove();
            $('#funSelect').append(option);
            $('#funSelect option:first').attr('selected');

            getAllGroups();
        }
    });
}

function getAllGroups(){
    var pmId = $('#funSelect').val();

    $.ajax({
        url: '/forbidden/getAllGroups',
        type: 'post',
        data: {'pmId':pmId},
        success: function (data) {
            var groupsList = '';
            for(var i= 0; i < data.groups.length; i++ ){
                groupsList += '<div style=\'width:30%; float:left;\'>';
                groupsList += '<input type=\'checkbox\' value=\''+ data.groups[i].USER_GROUP +'\'> ' + data.groups[i].USER_GROUP + ' </div>';
                if((i != 0) && (i % 3 == 2)){
                    groupsList += '<br />';
                }
            }
            $('#allGroupsDiv').html(groupsList);

            for(var i =0; i< data.data.length; i++){
                $('#allGroupsDiv input[type=checkbox]').each(function(index, item){
                    if(data.data[i].pgm_user_group == item.value){
                        console.log('yahoo');
                        $(item).attr('pgm_seq', data.data[i].pgm_seq);
                        $(item).attr('checked', 'checked');
                        //break;
                    }
                });
            }

            /*$('#allGroupsDiv input[type=checkbox]').each(function(index, item){
                for(var i =0; i< data.data.length; i++){
                    debugger;
                    if(data.data[i].pgm_user_group == item.value){
                        $(item).attr('pgm_seq', data.data[i].pgm_seq);
                    }
                }
            });*/
        }
    });
}
