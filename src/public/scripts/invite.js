$(document).ready(function () {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');

    document.querySelector('.box').style.display = 'none';
    document.querySelector('#join-class .btn-loading-box').style.display = 'none';
    const class_invite_code = location.href.split('/')[6].split('?')[0]

    $.ajax({
        url: `/api/class/invite/${class_invite_code}`,
        method: "GET",
        success: function(result) {
            if (result) {
                if(result.success == true) {
                    console.log(result.content)
                    document.querySelector('.title').innerText = result.content.name;
                    document.querySelector('.des').innerText = result.content.des;
                    document.querySelectorAll('.des2')[1].innerText = '클래스 오너: ' + result.content.owner;
                }
            } else {
                display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
            }
        },
        error: function(request, status, error) {
            if(request.responseJSON.message == 'The class does not exist') {
                document.querySelector('#join-class').classList.add('btn-blue-disabled');
                document.querySelector('#join-class').classList.remove('btn-blue');
                document.querySelector('.title').innerText = '죄송합니다';
                document.querySelector('.des').innerText = '해당 클래스를 찾을 수 없습니다.\nURL을 다시 한번 확인해주세요.';
                document.querySelectorAll('.des2')[1].innerText = '';
            }
            else if(request.responseJSON.message == 'The user is already student of the class') {
                document.querySelector('#join-class').classList.add('btn-blue-disabled');
                document.querySelector('#join-class').classList.remove('btn-blue');
                document.querySelector('.title').innerText = '죄송합니다';
                document.querySelector('.des').innerText = '이미 해당 클래스의 유저입니다.';
                document.querySelectorAll('.des2')[1].innerText = '';
            }
            else if(request.responseJSON.message == 'You are owner of the class') {
                document.querySelector('#join-class').classList.add('btn-blue-disabled');
                document.querySelector('#join-class').classList.remove('btn-blue');
                document.querySelector('.title').innerText = '죄송합니다';
                document.querySelector('.des').innerText = '자신이 생성한 클래스에는 참가할 수 없습니다.';
                document.querySelectorAll('.des2')[1].innerText = '';
            }
            else display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
        }
    });

    $('#join-class').click(function () {
        if(document.querySelector('#join-class').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#join-class .btn-loading-box').style.display = 'block';
        document.querySelector('#join-class').classList.add('btn-blue-disabled');
        document.querySelector('#join-class').classList.remove('btn-blue');

        $.ajax({
            url: `/api/class/invite/${class_invite_code}`,
            method: "POST",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('.box_').style.display = 'none';
                        document.querySelector('.box').style.display = 'block';
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
            }
        });
    })
});
