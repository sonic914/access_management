/**
 * 프로그램 관리 화면 script
 */
$(document).ready(function () {

    // 프로그램관리 테이블 병합 1: 프로그램, 2: 폼
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
        }
        // 삭제버튼 클릭 시
        else if (buttonName[1] == 'D') {

        }
        // 완료버튼 클릭 시(완료 -> 추가/수정)
        else if (buttonName[1] == 'C') {

            var data = {};
            var tagName = 'div';
            var thisObj = $(this);

            if(buttonName[0] == 'prg'){
                data.prgName = $(this).parent().parent().find('div input[name="prgName"]').val();
                data.prgExp = $(this).parent().parent().find('div input[name="prgExp"]').val();

                if(buttonName[2] == 'U'){
                    data.id = $(this).parent().parent().parent().find('td span input[name="id"]').val();
                }
                checkInput(data.prgName);
            }
            else if(buttonName[0] == 'form'){
                if(buttonName[2] == 'A'){
                    data.prgName = $(this).parent().parent().parent().find('td div input[name="prgName"]').val();
                    data.prgExp = $(this).parent().parent().parent().find('td div input[name="prgExp"]').val();
                }
                data.formName = $(this).parent().parent().find('div input[name="formName"]').val();
                data.formExp = $(this).parent().parent().find('div input[name="formExp"]').val();

                debugger;
                //if(buttonName[2] == 'U'){
                data.id = $(this).parent().parent().parent().find('td ul li span input[name="id"]').val();
                //}
                checkInput(data.formName);
            }
            else if (buttonName[0] == 'fun') {
                var tagName = 'span';

                if(buttonName[2] == 'A'){
                    data.prgName = $(this).parent().parent().parent().parent().parent().find('td div input[name="prgName"]').val();
                    data.prgExp = $(this).parent().parent().parent().parent().parent().find('td div input[name="prgExp"]').val();
                    data.formName = $(this).parent().parent().parent().parent().parent().find('td div input[name="formName"]').val();
                    data.formExp = $(this).parent().parent().parent().parent().parent().find('td div input[name="formExp"]').val();
                }
                debugger;
                data.funName = $(this).parent().parent().find('span input[name="funName"]').val();
                data.funExp = $(this).parent().parent().find('span input[name="funExp"]').val();

                //if(buttonName[2] == 'U'){
                data.id = $(this).parent().parent().find('span input[name="id"]').val();
                //}
                checkInput(data.funName);
            }

            data.mode = buttonName[2];
            data.gbn = buttonName[0];

            $.ajax({
                url: '/program/edit',
                type: 'post',
                data: data,
                success: function (data) {
                    console.log('success');
                    if (buttonName[2] == 'A') {
                        //btnName = '추가';
                        // input box display:none
                        //$(this).parent().parent().find('div input').each(function (index, item) {
                            //$(item).attr('style', 'display:none');
                        //});
                        debugger;
                        location.reload();
                    }
                    else {
                        console.log('else');
                        // input box 비활성화
                        $(thisObj).parent().parent().find(tagName + ' input').each(function (index, item) {
                            $(item).attr('readonly', 'readonly');
                        });

                        // 버튼명 추가 or 수정으로 다시 변경
                        $(thisObj).html('수정');
                        $(thisObj).attr('name', buttonName[0] + '_' + buttonName[2]);
                    }
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