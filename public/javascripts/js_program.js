/**
 * 프로그램 관리 화면 script
 */
$(document).ready(function () {

    // 프로그램관리 테이블 병합 1: 프로그램, 2: 폼, 3: 기능(펑션)
    $('#programListTable').rowspan(1);
    $('#programListTable').rowspan(2);
    $('#programListTable').rowspan(3);

    // 버튼 클릭 이벤트
    $('button').click(function () {
        var buttonName = '';
        buttonName = $(this).attr('name').split('_');

        var tagName = 'div';
        if (buttonName[0] == 'fun') {
            tagName = 'span'
        }

        // 삭제가 아닌 경우 버튼명과 name 속성을 완료, buttonName[0]_C_buttonName[1]로 변경
        if (buttonName[1] != 'D') {
            $(this).html('완료');
            $(this).attr('name', buttonName[0] + '_C_' + buttonName[1]);
        }

        // 추가버튼 클릭 시
        if (buttonName[1] == 'A') {
            // style='display:none;' 삭제
            $(this).parent().parent().find(tagName + ' input').each(function (index, item) {
                $(item).removeAttr('style');
            });
        }
        // 수정버튼 클릭 시
        else if (buttonName[1] == 'U') {

            // input box 활성화
            $(this).parent().parent().find(tagName + ' input').each(function (index, item) {
                $(item).removeAttr('readonly');
            });

            // 기존의 이름과 설명 저장하기(쿼리 조건문으로 사용)
            $(this).parent().parent().find(tagName + ' input').each(function (index, item) {
                $(item).attr('oldValue' + index, item.value);
            });

        }
        // 삭제버튼 클릭 시 or 완료버튼 클릭 시(완료 -> 추가/수정)
        else if (buttonName[1] == 'D' || buttonName[1] == 'C') {

            var data = {};
            var tagName = 'div';

            // ajax 통신 후 변경내용 반영하기 위해 변수 선언
            var thisObj = $(this);

            if(buttonName[0] == 'prg'){
                data.prgName = $.trim($(this).parent().parent().find('div input[name="prgName"]').val());
                data.prgExp = $(this).parent().parent().find('div input[name="prgExp"]').val().trim();

                if(buttonName[2] == 'U'){
                    data.id = $(this).parent().parent().parent().find('td span input[name="id"]').val();
                    data.oldName = $(this).parent().parent().find('div input[name="prgName"]').attr('oldValue0');
                    data.oldExp = $(this).parent().parent().find('div input[name="prgExp"]').attr('oldValue1');
                }
                checkInput(data.prgName);
            }
            else if(buttonName[0] == 'form'){
                data.prgName = $.trim($(this).parent().parent().parent().find('td div input[name="prgName"]').val());
                data.prgExp = $(this).parent().parent().parent().find('td div input[name="prgExp"]').val();
                data.oldName = $(this).parent().parent().find('div input[name="formName"]').attr('oldValue0');
                data.oldExp = $(this).parent().parent().find('div input[name="formExp"]').attr('oldValue1');

                data.formName = $.trim($(this).parent().parent().find('div input[name="formName"]').val());
                data.formExp = $(this).parent().parent().find('div input[name="formExp"]').val();
                data.id = $(this).parent().parent().parent().find('td ul li span input[name="id"]').val();
                checkInput(data.formName);
            }
            else if (buttonName[0] == 'fun') {
                var tagName = 'span';

                if(buttonName[2] == 'A'){
                    data.prgName = $.trim($(this).parent().parent().parent().parent().parent().find('td div input[name="prgName"]').val());
                    data.prgExp = $(this).parent().parent().parent().parent().parent().find('td div input[name="prgExp"]').val();
                    data.formName = $.trim($(this).parent().parent().parent().parent().parent().find('td div input[name="formName"]').val());
                    data.formExp = $(this).parent().parent().parent().parent().parent().find('td div input[name="formExp"]').val();
                }
                else if(buttonName[2] == 'U'){
                    data.oldName = $(this).parent().parent().find('span input[name="funName"]').attr('oldValue0');
                    data.oldExp = $(this).parent().parent().find('span input[name="funExp"]').attr('oldValue1');
                }

                data.funName = $.trim($(this).parent().parent().find('span input[name="funName"]').val());
                data.funExp = $(this).parent().parent().find('span input[name="funExp"]').val();
                data.id = $(this).parent().parent().find('span input[name="id"]').val();
                checkInput(data.funName);
            }
            // 삭제일 경우 mode는 buttonName[1]으로 설정
            if(buttonName[1] == 'D'){
                data.mode = buttonName[1];
            }else{
                data.mode = buttonName[2];
            }

            data.gbn = buttonName[0];

            $.ajax({
                url: '/program/edit',
                type: 'post',
                data: data,
                success: function (data) {
                    /*
                    if (buttonName[2] == 'U') {
                        console.log('else');
                        // input box 비활성화
                        $(thisObj).parent().parent().find(tagName + ' input').each(function (index, item) {
                            $(item).attr('readonly', 'readonly');
                        });

                        // 버튼명 추가 or 수정으로 다시 변경
                        $(thisObj).html('수정');
                        $(thisObj).attr('name', buttonName[0] + '_' + buttonName[2]);
                    }
                    else {
                    */
                        location.reload();
                    //}
                }
            });
        }
    });

    function checkInput(name){
        if(name == ''){
            alert('추가 할 내용을 입력하세요.');
            return false;
        }
    }
});