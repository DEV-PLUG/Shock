$(".home-menu-box").load("/views/partials/dashboard-menu.html");

$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');
    
    function load_class() {
        document.querySelector('#class-load-loading-box').style.display = 'block';
        document.querySelector('.no-class').style.display = 'none';

        $.ajax({
            url: "/api/class",
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        document.querySelector('#class-load-loading-box').style.display = 'none';
                        $('.class-box-wrap').empty();

                        if((result.content.user_class == null || result.content.user_class.length == 0) && (result.content.owner_class == null || result.content.owner_class.length == 0)) {
                            document.querySelector('.no-class').style.display = 'block';
                        } else {
                            if(result.content.owner_class != null && result.content.owner_class.length != 0) {
                                $('.class-box-wrap').append('<div class="class_wrap_title">소유한 클래스</div>');
                                for(var j = 0; j < result.content.owner_class.length; j++) {
                                    $('.class-box-wrap').append(`<div class="class-box-content"><div class="flex-between"><div class="flex"><div class="class-box-content-title">${result.content.owner_class[j].name}</div><div class="class-box-content-des"></div></div><div class="flex"><div class="class-box-content-btn2" id="${result.content.owner_class[j].id}">자세히 보기</div></div></div></div>`);
                                }
                            }
                            if(result.content.user_class != null && result.content.user_class.length != 0) {
                                $('.class-box-wrap').append('<div class="class_wrap_title">참여한 클래스</div>');
                                for(var j = 0; j < result.content.user_class.length; j++) {
                                    $('.class-box-wrap').append(`<div class="class-box-content"><div class="flex-between"><div class="flex"><div class="class-box-content-title">${result.content.user_class[j].name}</div><div class="class-box-content-des"></div></div><div class="flex"><div class="class-box-content-btn2" id="${result.content.user_class[j].id}">자세히 보기</div></div></div></div>`);
                                }
                            }

                            $('.class-box-content-btn2').click(function () {
                                location.href = `/dashboard/class/${$(this).attr('id')}`;
                            });
                        }
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
            }
        });
    }
    load_class();

    $('.add-class-btn').click(function () {
        modal('create-class');

        document.querySelector('#class-title').value = '';
        document.querySelector('#class-des').value = '';

        document.querySelector('#create_class_next_btn').classList.add('btn-blue');
        document.querySelector('#create_class_next_btn').classList.remove('btn-blue-disabled');
        document.querySelector('#add-class-btn-loading-box').style.display = 'none';

        document.querySelector('.create-class-modal-end').style.display = 'block';
        document.querySelector('.modal-create-class-content1').style.display = 'block';
        document.querySelector('.modal-create-class-content2').style.display = 'none';

        document.querySelector('#create-class-check').style.display = 'none';

        document.querySelector('.modal-create-class-content1').style.right = '0px';
        document.querySelector('.modal-create-class-content1').style.opacity = '1';
        document.querySelector('.modal-create-class-content2').style.left = '20px';
        document.querySelector('.modal-create-class-content2').style.opacity = '0';
    });
    $('.add-class-btn2').click(function () {
        modal('create-class');

        document.querySelector('#class-title').value = '';
        document.querySelector('#class-des').value = '';

        document.querySelector('#create_class_next_btn').classList.add('btn-blue');
        document.querySelector('#create_class_next_btn').classList.remove('btn-blue-disabled');
        document.querySelector('#add-class-btn-loading-box').style.display = 'none';

        document.querySelector('.create-class-modal-end').style.display = 'block';
        document.querySelector('.modal-create-class-content1').style.display = 'block';
        document.querySelector('.modal-create-class-content2').style.display = 'none';

        document.querySelector('#create-class-check').style.display = 'none';

        document.querySelector('.modal-create-class-content1').style.right = '0px';
        document.querySelector('.modal-create-class-content1').style.opacity = '1';
        document.querySelector('.modal-create-class-content2').style.left = '20px';
        document.querySelector('.modal-create-class-content2').style.opacity = '0';
    });
    $('#create_class_next_btn').click(function () {
        if(document.querySelector('#create_class_next_btn').classList.contains('btn-blue-disabled')) return;

        if(document.querySelector('#class-title').value == '' || document.querySelector('#class-des').value == '' || document.querySelector('#class-title').value.length > 20 || document.querySelector('#class-des').value.length > 50) {
            if(document.querySelector('#class-title').value == '' || document.querySelector('#class-title').value.length > 20) {
                document.querySelector('#class-title').classList.add('input-red');
            }
            if(document.querySelector('#class-des').value == '' || document.querySelector('#class-des').value.length > 50) {
                document.querySelector('#class-des').classList.add('input-red');
               }
        } else {
            document.querySelector('#create_class_next_btn').classList.remove('btn-blue');
            document.querySelector('#create_class_next_btn').classList.add('btn-blue-disabled');
            document.querySelector('#add-class-btn-loading-box').style.display = 'block';

            $.ajax({
                url:"/api/class",
                method:"POST",
                beforeSend : function(xhr){
                    xhr.setRequestHeader("Content-type","application/json");
                },
                data: JSON.stringify({
                    key: 'Shock',
                    class_title: document.querySelector('#class-title').value,
                    class_des: document.querySelector('#class-des').value
                }),
                success: function(result) {
                    if (result) {
                        if(result.success == true) {
                            document.querySelector('.create-class-modal-end').style.display = 'none';
                            document.querySelector('#add-class-btn-loading-box').style.display = 'none';

                            load_class();
                    
                            $('.modal-create-class-content1').animate({
                                opacity: '0',
                                right: '20px'
                            }, 0, 'swing', function() {
                                $('.modal-create-class-content1').animate({
                                    display: 'none'
                                }, 200, 'swing', function() {
                                    document.querySelector('.modal-create-class-content1').style.display = 'none';
                                    document.querySelector('.modal-create-class-content2').style.display = 'block';
                    
                                    $('.modal-create-class-content2').animate({
                                        opacity: '1',
                                        left: '0'
                                    }, 0, 'swing', function() {
                                        if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                                            document.querySelector('#create-class-check').style.display = 'none';
                                            document.querySelector('.create-class-check-img').style.display = 'block';
                                        } else {
                                            document.querySelector('.create-class-check-img').style.display = 'none';
                                            document.querySelector('#create-class-check').style.display = 'block';
                                        }
                                        document.querySelector('#create-class-check').play();
                                    });
                                });
                            });
                        } else {
                            display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                        }
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                    }
                },
                error: function(request, status, error) {

                    document.querySelector('#create_class_next_btn').classList.add('btn-blue');
                    document.querySelector('#create_class_next_btn').classList.remove('btn-blue-disabled');
                    document.querySelector('#add-class-btn-loading-box').style.display = 'none';

                    if(request.status == 429) { // too many request
                        display_message('클래스 생성을 너무 많이 시도하셨습니다.', 'red')
                    }
                    else if(request.responseJSON.message == 'The user cannot make class more then 3') display_message('클래스는 한 유저당 최대 3개까지만 생성 가능해요.', 'red');
                    else if(request.responseJSON.message == 'Title must include only English, Korean and number') document.querySelector('#class-title').classList.add('input-red');
                    else if(request.responseJSON.message == 'Description must include only English, Korean and number') document.querySelector('#class-title').classList.add('input-red');
                    else if(result.code == 500) display_message('알 수 없는 오류가 발생했습니다.(4)', 'red');
                    else {
                        display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                    }
                }
            });
        }
    });
    $("#class-title").on("propertychange change keyup paste input", function() {
		document.querySelector('#class-title').classList.remove('input-red');
	});
    $("#class-des").on("propertychange change keyup paste input", function() {
		document.querySelector('#class-des').classList.remove('input-red');
	});
    $('#create-class_close_id').click(function () {
        close_modal('create-class');
    });

});