/**
 * Created by hyelim on 2015. 12. 15..
 */
/**
 * 예외 관리 화면 script
 */
$(document).ready(function () {
    $('#start_date').datepicker({
        format: 'yyyy-mm-dd',
        language: "kr"
    });

    $('#end_date').datepicker({
        format: 'yyyy-mm-dd',
        language: "kr"
    });

    $('div form div[show=\'after\'] ').each(function(index, item){
       $(this).hide();
    });
    $('#saveExcUser').hide();

    // 검색버튼 클릭 시
    $('#searchExcUser').click(function(){
        var sabun = $('#sabun').val();
        if(sabun == ''){
            alert('사번을 입력하세요.');
            return false;
        }
        $.ajax({
            url: '/exception/getUserGroup',
            type: 'post',
            data: {sabun:sabun},
            success: function (data) {
                var groups = data.data;
                //debugger;
                if(groups.length != 0){
                    var option = '';
                    for(var i=0; i<groups.length; i++){
                        option += '<option>' + groups[i].USER_GROUP +' </option>'
                    }
                    $('#user_group option').remove();
                    $('#user_group').append(option);
                    $('#user_group option:first').attr('selected');

                    getForbiddenPrg();
                }
                else{
                    alert('사번에 해당하는 그룹이 없습니다.');
                    $('div form div[show=\'after\'] ').each(function(index, item){
                        $(this).hide();
                    });

                    $('#saveExcUser').hide();
                }
            }
        });
    });

    // 저장버튼 클릭 시
    $('#saveExcUser').click(function(){
        var data = {};
        data.sabun = $('#sabun').val();
        data.pgmSeq = $('#forbiddenPrgSelect').val();
        data.startDate = $('#start_date').val();
        data.endDate = $('#end_date').val();

        var fullName = $('#exePrgListTbody tr td input[name=fullName]');
        for(var i=0; i < fullName.length; i++){
            var name = $('#forbiddenPrgSelect option:selected').attr('fullName');
            if(name == fullName[i].value){
                alert('해당 프로그램은 이미 예외처리 되었습니다.');
                return false;
            }
        }
        $.ajax({
            url: '/exception/saveExcUser',
            type: 'post',
            data: data,
            success: function (data) {
                getForbiddenPrg();
                //getExcUserPrg();
            }
        });
    });
});

function getForbiddenPrg(){
    var userGroup = $('#user_group').val();

    $.ajax({
        url: '/exception/getForbiddenPrg',
        type: 'post',
        data: {userGroup:userGroup},
        success: function (data) {
            getExcUserPrg();
            var list = data.data;

            if(list.length > 0){
                var option = '';
                for(var i=0; i < list.length; i++){
                    option += '<option value=\'' + list[i].pgm_seq + '\' fullName=\''+ list[i].prg_name +'\'>' + list[i].prg_exp +' </option>'
                }
                $('#forbiddenPrgSelect option').remove();
                $('#forbiddenPrgSelect').append(option);

                $('div form div[show=\'after\'] ').each(function(index, item){
                    $(this).show();
                });

                $('#saveExcUser').show();
            }
            else{
                alert('해당그룹에 제한 프로그램이 없습니다.');
                $('div form div[show=\'after\'] ').each(function(index, item){
                    $(this).hide();
                });

                $('#saveExcUser').hide();
            }
        }
    });
}

function getExcUserPrg(){
    var sabun = $('#sabun').val();

    $.ajax({
        url: '/exception/getExcUserPrg',
        type: 'post',
        data: {sabun:sabun},
        success: function (data) {
            var list = data.data;
            var innerHTML = '';

            if(list.length > 0){
                for(var i=0; i < list.length; i++){
                    innerHTML += '<tr>';
                    innerHTML += '  <td>' + list[i].pm_prg_exp + '</td>';
                    innerHTML += '  <td>' + list[i].pm_form_exp + '</td>';
                    innerHTML += '  <td>' + list[i].pm_fun_exp + '</td>';
                    innerHTML += '  <td>' + list[i].pum_str_date.substr(0, 10) + '</td>';
                    innerHTML += '  <td>' + list[i].pum_end_date.substr(0, 10) + '</td>';
                    innerHTML += '  <td> <input type=\'button\' onclick=\'delExcUserPrg(' + list[i].pum_seq +');\' class=\'btn btn-xs btn-danger\' value=\'삭제\' />';
                    //innerHTML += '<input type=\'hidden\' name=\'pumSeq\' value=' + list[i].pum_seq + '>';
                    innerHTML += '<input type=\'hidden\' name=\'fullName\' value=' + list[i].pm_prg_name + '_' + list[i].pm_form_name + '_' + list[i].pm_fun_name + '></td>';
                    innerHTML += '</tr>';
                }
            }
            else{
                innerHTML += '<tr>';
                innerHTML += '  <td colspan=\'6\'>조회 된 예외 프로그램이 없습니다.</td>';
                innerHTML += '</tr>';
            }
            $('#exePrgListTbody').html(innerHTML);
        }
    });
}


function delExcUserPrg(pumSeq){
    console.log(pumSeq);

    $.ajax({
        url: '/exception/delExcUserPrg',
        type: 'post',
        data: {pumSeq:pumSeq},
        success: function (data) {
            getExcUserPrg();
        }
    });
}