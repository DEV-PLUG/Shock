// location.href = '/service';

$(".home-menu-box").load("/views/partials/menu.html");

$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');

    // // 모바일 기기 인식
    // if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
    //     location.href = '/mobile';
    // }

    // 이메일, 비밀번호 텍스트 변경 이벤트 감지
    $("#manager_email_name").on("propertychange change paste input", function() {
		document.querySelector('#manager_email_name').classList.remove('input-red');
	});
	$("#manager_password").on("propertychange change paste input", function() {
		document.querySelector('#manager_password').classList.remove('input-red');
	});

    let redirect_type = null, redirect_id = null;

    // 로그인 버튼 클릭 이벤트 감지
    $('#login-login-btn').click(function () {

        if(document.querySelector('#login-login-btn').classList.contains('btn-blue')) {
            if(document.querySelector('#manager_email_name').value == '' || document.querySelector('#manager_password').value == '' || document.querySelector('#manager_email_name').value.length > 320 || document.querySelector('#manager_password').value.length > 50) {
                if(document.querySelector('#manager_email_name').value == '' || document.querySelector('#manager_email_name').value.length > 320) {
                    document.querySelector('#manager_email_name').classList.add('input-red');
                }
                if(document.querySelector('#manager_password').value == '' || document.querySelector('#manager_password').value.length > 50) {
                    document.querySelector('#manager_password').classList.add('input-red');
                }
            } else {
                document.querySelector('#login-login-btn').classList.add('btn-blue-disabled');
                document.querySelector('#login-login-btn').classList.remove('btn-blue');
                document.querySelector('.btn-loading-box').style.display = 'block';
                
                $.ajax({
                    url:"/api/login",
                    method:"POST",
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("Content-type","application/json");
                    },
                    data: JSON.stringify({
                        key: 'Shock',
                        user_email_name: document.querySelector('#manager_email_name').value,
                        user_password: CryptoJS.AES.encrypt(JSON.stringify(document.querySelector('#manager_password').value), "LDAFJEIJFADS23KFLSJDKFLAKJFE23OJFSOIJFDKOJE89KODJKSDLJSKLEQP22LDXZWAWODJSKAL").toString()
                    }),
                    success: function(result) {
                        if (result) {
                            if(result.success == true) {
                                if(redirect_type == null) {
                                    location.href = '/dashboard';
                                } else if(redirect_type == 'share') {
                                    location.href = `/dashboard/words/share/${redirect_id}`;
                                } else if(redirect_type == 'invite') {
                                    location.href = `/dashboard/class/invite/${redirect_id}`;
                                }
                            }
                            else display_message('알 수 없는 오류가 발생했습니다.(3)', 'red');
                        } else {
                            document.querySelector('#login-login-btn').classList.add('btn-blue');
                            document.querySelector('#login-login-btn').classList.remove('btn-blue-disabled');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                        }
                    },
                    error: function(request, status, error) {

                        document.querySelector('#login-login-btn').classList.remove('btn-blue-disabled');
                        document.querySelector('#login-login-btn').classList.add('btn-blue');
                        document.querySelector('.btn-loading-box').style.display = 'none';

                        if(request.status == 429) { // too many request
                            document.querySelector('#login-login-btn').classList.add('btn-blue-disabled');
                            document.querySelector('#login-login-btn').classList.remove('btn-blue');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('로그인을 너무 많이 시도하셨습니다.', 'red')
                        }
                        else if(request.responseJSON.message == 'The password does not match') document.querySelector('#manager_password').classList.add('input-red');
                        else if(request.responseJSON.message == 'The user does not exist') document.querySelector('#manager_email_name').classList.add('input-red');
                        else if(result.code == 500) display_message('알 수 없는 오류가 발생했습니다.(4)', 'red');
                        else {
                            document.querySelector('#login-login-btn').classList.add('btn-blue');
                            document.querySelector('#login-login-btn').classList.remove('btn-blue-disabled');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                        }
                    }
                });
            }
        }
	});

    if(window.location.href.split('?')[1] != undefined && window.location.href.split('?')[1].split('=')[1].substring(0, 6) == 'share-' && /[0-9]/.test(window.location.href.split('?')[1].split('=')[1].substring(6, 24)) && window.location.href.split('?')[1].split('=')[1].substring(6, 24).length == 18) {
        document.querySelector('.redirect-info-box').style.display = 'flex';
        document.querySelector('.redirect-info-box-text').innerText = '로그인이 필요한 기능이에요! 로그인을 완료하면 단어장 공유 페이지로 슉 이동시켜 드릴게요!';

        redirect_type = 'share';
        redirect_id = window.location.href.split('?')[1].split('=')[1].substring(6, 24);
    }
    if(window.location.href.split('?')[1] != undefined && window.location.href.split('?')[1].split('=')[1].substring(0, 7) == 'invite-') {
        document.querySelector('.redirect-info-box').style.display = 'flex';
        document.querySelector('.redirect-info-box-text').innerText = '로그인이 필요한 기능이에요! 로그인을 완료하면 클래스 초대 페이지로 슉 이동시켜 드릴게요!';

        redirect_type = 'invite';
        redirect_id = window.location.href.split('?')[1].split('=')[1].substring(7, 18);
    }

});