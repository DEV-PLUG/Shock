$(document).ready(function () {

    // 모바일 기기 인식
    if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
        location.href = '/mobile'
    }

    $(".home-menu-box").load("/views/partials/menu.html");

    document.querySelector('.btn-loading-box').style.display = 'none';

    $("#user_email").on("propertychange change paste input", function() {
		document.querySelector('#user_email').classList.remove('input-red');
	});
    $("#user_name").on("propertychange change paste input", function() {
		document.querySelector('#user_name').classList.remove('input-red');
	});
    $("#user_password").on("propertychange change paste input", function() {
		document.querySelector('#user_password').classList.remove('input-red');
	});
    $("#user_re_password").on("propertychange change paste input", function() {
		document.querySelector('#user_re_password').classList.remove('input-red');
	});

    $('#signup-policy-checkbox-box').click(function () {
        if(document.querySelector('.btn-loading-box').style.display == 'none') {
            checkbox('signup-policy');

            if(document.querySelector('#signup-policy-checkbox').classList.contains('checkbox-focus') && document.querySelector('#signup-privacy-checkbox').classList.contains('checkbox-focus')) {
                document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
            } else {
                document.querySelector('#signup-signup-btn').classList.add('btn-blue-disabled');
                document.querySelector('#signup-signup-btn').classList.remove('btn-blue');
            }
        }
	});
    $('#signup-privacy-checkbox-box').click(function () {
        if(document.querySelector('.btn-loading-box').style.display == 'none') {
            checkbox('signup-privacy');

            if(document.querySelector('#signup-policy-checkbox').classList.contains('checkbox-focus') && document.querySelector('#signup-privacy-checkbox').classList.contains('checkbox-focus')) {
                document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
            } else {
                document.querySelector('#signup-signup-btn').classList.add('btn-blue-disabled');
                document.querySelector('#signup-signup-btn').classList.remove('btn-blue');
            }
        }
	});

    var pattern1 = /[0-9]/;
    var pattern2 = /[a-zA-Z]/;
    var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;
    
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    $('#signup-signup-btn').click(function () {

        if(document.querySelector('#signup-signup-btn').classList.contains('btn-blue')) {
            if(document.querySelector('#user_email').value.match(regExp) == null || document.querySelector('#user_password').value != document.querySelector('#user_re_password').value || !pattern1.test(document.querySelector('#user_password').value) || !pattern2.test(document.querySelector('#user_password').value) || !pattern3.test(document.querySelector('#user_password').value) || document.querySelector('#user_email').value == '' || document.querySelector('#user_name').value == '' || document.querySelector('#user_password').value == '' || document.querySelector('#user_re_password').value == '' || document.querySelector('#user_email').value.length > 320 || document.querySelector('#user_name').value.length > 20 || document.querySelector('#user_password').value.length > 50 || document.querySelector('#user_password').value.length < 5 || document.querySelector('#user_re_password').value.length > 50) {
                if(document.querySelector('#user_email').value == '' || document.querySelector('#user_email').value.length > 320) {
                    document.querySelector('#user_email').classList.add('input-red');
                }
                if(document.querySelector('#user_name').value == '' || document.querySelector('#user_name').value.length > 20) {
                    document.querySelector('#user_name').classList.add('input-red');
                }
                if(document.querySelector('#user_password').value == '' || document.querySelector('#user_password').value.length > 50 || document.querySelector('#user_password').value.length < 5) {
                    document.querySelector('#user_password').classList.add('input-red');
                }
                if(!pattern1.test(document.querySelector('#user_password').value) || !pattern2.test(document.querySelector('#user_password').value) || !pattern3.test(document.querySelector('#user_password').value)) {
                    document.querySelector('#user_password').classList.add('input-red');
                }
                if(document.querySelector('#user_re_password').value == '' || document.querySelector('#user_password').value.length > 50) {
                    document.querySelector('#user_re_password').classList.add('input-red');
                }
                if(document.querySelector('#user_email').value.match(regExp) == null) {
                    document.querySelector('#user_email').classList.add('input-red');
                }
                if (document.querySelector('#user_password').value != document.querySelector('#user_re_password').value) {
                    document.querySelector('#user_re_password').classList.add('input-red');
                }
            } else {
                document.querySelector('#signup-signup-btn').classList.add('btn-blue-disabled');
                document.querySelector('#signup-signup-btn').classList.remove('btn-blue');
                document.querySelector('.btn-loading-box').style.display = 'block';
                
                $.ajax({
                    url:"/api/signup",
                    method:"POST",
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("Content-type","application/json");
                    },
                    data: JSON.stringify({
                        key: 'Shock',
                        user_email: document.querySelector('#user_email').value,
                        user_name: document.querySelector('#user_name').value,
                        user_password: CryptoJS.AES.encrypt(JSON.stringify(document.querySelector('#user_password').value), "LDAFJEIJFADS23KFLSJDKFLAKJFE23OJFSOIJFDKOJE89KODJKSDLJSKLEQP22LDXZWAWODJSKAL").toString(),
                        user_re_password: CryptoJS.AES.encrypt(JSON.stringify(document.querySelector('#user_re_password').value), "LDAFJEIJFADS23KFLSJDKFLAKJFE23OJFSOIJFDKOJE89KODJKSDLJSKLEQP22LDXZWAWODJSKAL").toString()
                    }),       
                    success: function(result) {
                        if (result) {
                            console.log(result)
                            if(result.success == true) location.href = '/signup/success';
                            else display_message('알 수 없는 오류가 발생했습니다.(3)', 'red');
                        } else {
                            document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                            document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                        }
                    },
                    error: function(request, status, error){

                        document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                        document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
                        document.querySelector('.btn-loading-box').style.display = 'none';

                        if(request.status == 429) { // too many request
                            document.querySelector('#signup-signup-btn').classList.add('btn-blue-disabled');
                            document.querySelector('#signup-signup-btn').classList.remove('btn-blue');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('회원가입을 너무 많이 시도하셨습니다.', 'red');
                        }
                        else if(request.status == 500) { // 알 수 없는 오류
                            document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                            document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                        }
                        else if(request.responseJSON.message == 'The id already exist') {
                            document.querySelector('#user_name').classList.add('input-red');
                            display_message('누군가 사용하고 있는 아이디입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'There is a blank in the id') {
                            document.querySelector('#user_name').classList.add('input-red');
                            display_message('아이디에는 공백을 포함할 수 없습니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The email already exist') {
                            document.querySelector('#user_email').classList.add('input-red');
                            display_message('누군가 사용하고 있는 이메일입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'There is a blank in the email') {
                            document.querySelector('#user_email').classList.add('input-red');
                            display_message('이메일에는 공백을 포함할 수 없습니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The email does not fit the pattern') {
                            document.querySelector('#user_email').classList.add('input-red');
                            display_message('이메일 형식에 맞지 않습니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The password does not fit the pattern') {
                            document.querySelector('#user_password').classList.add('input-red');
                            display_message('비밀번호 형식에 맞지 않습니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The id is too long') {
                            document.querySelector('#user_name').classList.add('input-red');
                            display_message('아이디는 최대 20자입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The email is too long') {
                            document.querySelector('#user_email').classList.add('input-red');
                            display_message('이메일는 최대 320자입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The password is too long') {
                            document.querySelector('#user_password').classList.add('input-red');
                            display_message('비밀번호는 최대 50자입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The password is too short') {
                            document.querySelector('#user_password').classList.add('input-red');
                            display_message('비밀번호는 최소 5자입니다.', 'yellow');
                        }
                        else if(request.responseJSON.message == 'The password is not same') {
                            document.querySelector('#user_re_password').classList.add('input-red');
                            display_message('비밀번호가 일치하지 않습니다.', 'yellow');
                        }
                        else {
                            document.querySelector('#signup-signup-btn').classList.add('btn-blue');
                            document.querySelector('#signup-signup-btn').classList.remove('btn-blue-disabled');
                            document.querySelector('.btn-loading-box').style.display = 'none';
                            display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                        }
                    }
                });
            }
        }
	});
});