/**
 * 프로그램 관리 화면 script
 */
$(document).ready(function () {

    // 프로그램관리 테이블 병합 1: 프로그램, 2: 폼
    $('#programListTable').rowspan(1);
    $('#programListTable').rowspan(2);

    // 버튼 클릭 이벤트
    $('button').click(function () {
        var buttonName = '';
        buttonName = $(this).attr('name').split('_');

        // 삭제가 아닌 경우 버튼명과 name 속성을 완료, buttonName[0]_C_buttonName[1]로 변경
        if (buttonName[1] != 'D') {
            $(this).html('완료');
            $(this).attr('name', buttonName[0] + '_C_' + buttonName[1]);
        }

        // 추가버튼 클릭 시
        if (buttonName[1] == 'A') {
            $(this).parent().parent().find('div input').each(function (index, item) {
                $(item).removeAttr('style');
                //$(item).attr('style', 'border:1px solid gray; margin:1px')
            });
        }
        // 수정버튼 클릭 시
        else if (buttonName[1] == 'U') {

            var tagName = 'div';
            if (buttonName[0] == 'fun') {
                tagName = 'span'
            }
            // input box 활성화
            $(this).parent().parent().find(tagName + ' input').each(function (index, item) {
                $(item).removeAttr('readonly');
            });
        }
        // 삭제버튼 클릭 시
        else if (buttonName[1] == 'D') {

        }
        // 완료버튼 클릭 시
        else if (buttonName[1] == 'C') {

            var tagName = 'div';
            var inputName = '';
            var inputExp = '';

            if(buttonName[0] == 'prg'){
                inputName = 'prgName';
                inputExp = 'prgExp';
            }
            else if(buttonName[0] == 'form'){
                inputName = 'prgName';
                inputExp = 'prgExp';
            }
            else if (buttonName[0] == 'fun') {
                tagName = 'span';
                inputName = 'prgName';
                inputExp = 'prgExp';
            }

            var name = $(this).parent().parent().find(tagName + ' input[name="' + inputName + '"]').val();
            var exp = $(this).parent().parent().find(tagName + ' input[name="' + inputName + '"]').val();

            if(name == ''){
                alert('추가 할 내용을 입력하세요.');
                return false;
            }

            $.ajax({
                url: '/program/add',
                type: 'post',
                data: {name: name, exp: exp, mode: buttonName[2], gbn: buttonName[0]},
                success: function (data) {
                    var btnName = '수정';
                    if (buttonName[2] == 'A') {
                        //btnName = '추가';
                        // input box display:none
                        //$(this).parent().parent().find('div input').each(function (index, item) {
                            //$(item).attr('style', 'display:none');
                        //});
                        location.reload();
                    }
                    else {
                        // input box 비활성화
                        $(this).parent().parent().find(tagName + ' input').each(function (index, item) {
                            $(item).attr('readonly', 'readonly');
                        });
                    }

                    // 버튼명 추가 or 수정으로 다시 변경
                    $(this).html(btnName);
                    $(this).attr('name', buttonName[0] + '_' + buttonName[2]);
                }
            });
        }
    });
});