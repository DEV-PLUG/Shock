$(".home-menu-box").load("/views/partials/dashboard-menu.html");

var add_log_select_student, add_log_select_words;
function add_log_student_option(student) {
    add_log_select_student = student;
    option('add-log-student', student);
}
function add_log_words_option(words_name, words_id) {
    add_log_select_words = words_id;
    option('add-log-words', words_name);
}

$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');

    const class_id = location.href.split('/')[5].split('?')[0];

    var selected_delete_study_log_id, selected_edit_study_log_id, selected_kick_student;
    
    function load_class_detail() {
        $.ajax({
            url: `/api/class/${class_id}`,
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#class-load-loading-box').style.display = 'none';
                        console.log(result.content);

                        document.querySelector('.class_name').innerText = `> ${result.content.name}`;

                        if(result.content.position == 'student') {
                            document.querySelector('.student_btn_box').style.display = 'block';
                            document.querySelector('.owner_btn_box').style.display = 'none';
                        } else {
                            document.querySelector('.student_btn_box').style.display = 'none';
                            document.querySelector('.owner_btn_box').style.display = 'block';
                        }

                        document.querySelector('#edit-class-title').value = result.content.name;
                        document.querySelector('#edit-class-des').value = result.content.des;
                        document.querySelector('.class-invite-code-text').innerText = 'https://shock-english.ml/dashboard/class/invite/' + result.content.invite_code;

                        $('.class-detail-box-wrap').empty();
                        if(result.content.words.length > 0) {
                            $('.class-detail-box-wrap').append(`<div class="class_wrap_title">단어장</div>`);
                            for(var q = 0; q < result.content.words.length; q++) {
                                $('.class-detail-box-wrap').append(`<div class="class-box-content">
                                    <div class="flex-between">
                                        <div class="flex study_log_box">
                                            <div class="class-box-content-title">${result.content.words[q].name}</div>
                                            <div class="class-box-content-des">${result.content.words[q].length}개의 단어</div>
                                        </div>
                                    </div>
                                </div>`);
                            }
                        }
                        if(result.content.study_log.length > 0 && result.content.position == 'owner') {
                            $('.class-detail-box-wrap').append(`<div class="class_wrap_title">학습 기록</div>`);
                            for(var q = 0; q < result.content.study_log.length; q++) {
                                $('.class-detail-box-wrap').append(`<div class="class-box-content">
                                    <div class="flex-between">
                                        <div class="flex study_log_box">
                                            <div class="class-box-content-title">${result.content.study_log[q].user}</div>
                                            <div class="class-box-content-des">${result.content.study_log[q].createdAt.split('-')[0]}년 ${result.content.study_log[q].createdAt.split('-')[1]}월 ${result.content.study_log[q].createdAt.split('-')[2].split(' ')[0]}일 ${result.content.study_log[q].createdAt.split('-')[2].split(' ')[1].split(':')[0]}시 ${result.content.study_log[q].createdAt.split('-')[2].split(' ')[1].split(':')[1]}분</div>
                                        </div>
                                        <div class="flex">
                                            <div class="class-content-btn class-content-btn-edit" id="${result.content.study_log[q].id}"><span class="material-icons class-content-btn-icon class-content-btn-edit-icon">edit</span></div>
                                            <div class="class-content-btn class-content-btn-delete" id="${result.content.study_log[q].id}"><span class="material-icons class-content-btn-icon class-content-btn-delete-icon">delete</span></div>
                                        </div>
                                    </div>
                                </div>`);
                            }

                            $(document.querySelectorAll('.class-content-btn-delete')).click(function () {
                                selected_delete_study_log_id = $(this).attr('id');

                                document.querySelector('#delete_log-btn-loading-box').style.display = 'none';
                                modal('delete-log');
                            });

                            $(document.querySelectorAll('.class-content-btn-edit')).click(function () {
                                $(".message-box2").append(`<div class="message-content2"><div class="flex-center"><div class="btn-loading-box" style="margin: 7px;"><div class="btn-loading-circle"></div></div><div class="message-content-text2">단어장 정보를 불러오고 있습니다, 잠시만 기다려 주세요.</div></div></div>`);
                                $(document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1]).animate({
                                    bottom: '40px',
                                    opacity: '1'
                                }, 100);
                                const message_content_el2 = document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1];

                                selected_edit_study_log_id = $(this).attr('id');

                                var wrong_words_edit_data;
                                $.ajax({
                                    url: `/api/class/${class_id}/study_log/${selected_edit_study_log_id}`,
                                    method: "GET",
                                    success: function(result) {
                                        if (result) {
                                            if(result.success == true) {
                                                wrong_words_edit_data = result.content;
                                                load_edit_words_checkbox(wrong_words_edit_data);
                                            }
                                        } else {
                                            display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                                        }
                                    },
                                    error: function(request, status, error) {
                                        if(request.status == 429) { // too many request
                                            display_message('단어장 삭제를 너무 많이 시도하셨습니다.', 'red');
                                        }
                                        else {
                                            display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                                        }
                                    }
                                });

                                function load_edit_words_checkbox(wrong_words_edit_data) {
                                    $.ajax({
                                        url: `/api/words/${wrong_words_edit_data.words_id}`,
                                        method: "GET",
                                        success: function(result) {
                                            if (result) {
                                                if(result.success == true) {
                                                    $('.modal-edit-log-content-box').empty();
                    
                                                    for(var k = 0; k < result.content.words.length; k++) {
                                                        if(wrong_words_edit_data.wrong_words.indexOf(result.content.words[k][0]) == -1) {
                                                            $('.modal-edit-log-content-box').append(`<div class="flex" onclick="checkbox('edit-log-${result.content.words[k][0].replace(' ', '-')}')">
                                                                <div class="checkbox" id="edit-log-${result.content.words[k][0].replace(' ', '-')}-checkbox">
                                                                    <div class="checkbox-check"></div>
                                                                </div>
                                                                <span style="line-height: 27px; margin: 0 0 0 10px">${result.content.words[k][0]}</span>
                                                            </div>`);
                                                        } else {
                                                            $('.modal-edit-log-content-box').append(`<div class="flex" onclick="checkbox('edit-log-${result.content.words[k][0].replace(' ', '-')}')">
                                                                <div class="checkbox checkbox-focus" id="edit-log-${result.content.words[k][0].replace(' ', '-')}-checkbox">
                                                                    <div class="checkbox-check"></div>
                                                                </div>
                                                                <span style="line-height: 27px; margin: 0 0 0 10px">${result.content.words[k][0]}</span>
                                                            </div>`);
                                                        }
                                                    }
    
                                                    document.querySelector('#edit_log-btn-loading-box').style.display = 'none';
                                                    $(message_content_el2).remove();
                                                    modal('edit-log');
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
                            });
                        }
                        if(result.content.students.length > 0) {
                            $('.class-detail-box-wrap').append(`<div class="class_wrap_title">학생</div>`);
                            for(var q = 0; q < result.content.students.length; q++) {
                                if(result.content.position == 'owner') {
                                    $('.class-detail-box-wrap').append(`<div class="class-box-content">
                                        <div class="flex-between">
                                            <div class="flex">
                                                <div class="class-box-content-title">${result.content.students[q]}</div>
                                            </div>
                                            <div class="flex">
                                                <div class="class-content-btn class-content-btn-kick" id="${result.content.students[q]}"><span class="material-icons class-content-btn-icon class-content-btn-delete-icon">logout</span></div>
                                            </div>
                                        </div>
                                    </div>`);
                                } else {
                                    $('.class-detail-box-wrap').append(`<div class="class-box-content">
                                        <div class="flex-between">
                                            <div class="flex">
                                                <div class="class-box-content-title">${result.content.students[q]}</div>
                                            </div>
                                        </div>
                                    </div>`);
                                }
                            }

                            $(document.querySelectorAll('.class-content-btn-kick')).click(function () {
                                selected_kick_student = $(this).attr('id');

                                document.querySelector('#kick_student-btn-loading-box').style.display = 'none';
                                modal('kick-student');
                            });
                        }

                        if(result.content.students.length <= 0 || result.content.words.length <= 0) {
                            document.querySelector('.add-log-btn').classList.add('btn-blue-disabled');
                            document.querySelector('.add-log-btn').classList.remove('btn-blue');
                        }
                        if(result.content.students.length <= 0 && result.content.study_log.length <= 0 && result.content.words.length <= 0) {
                            document.querySelector('.no-class').style.display = 'block';
                            document.querySelector('.no-class').innerText = '너무나도 조용한 것 같아요!\n새로운 학생을 초대해 보는게 어떨까요?';
                        }
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                document.querySelector('#class-load-loading-box').style.display = 'none';
                if(request.status == 429) { // too many request
                    display_message('불러오기를 너무 많이 시도하셨습니다.', 'red')
                }
                else if(request.responseJSON.message == 'The class does not exist') {
                    document.querySelector('.no-class').style.display = 'block';
                    document.querySelector('.no-class').innerText = '해당 클래스를 찾을 수 없습니다.\n다시 한번 확인해주세요.';
                }
                else if(request.responseJSON.message == 'You are not onwer or student of the class') {
                    document.querySelector('.no-class').style.display = 'block';
                    document.querySelector('.no-class').innerText = '귀하께서는 해당 클래스의 관련자가 아닙니다.\n다시 한번 확인해주세요.';
                }
                else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }
            }
        });
    }
    load_class_detail();

    $('.out-class-btn').click(function () {
        document.querySelector('#out_class-btn-loading-box').style.display = 'none';
        modal('out-class');
    });

    $('#manage-class_close_id').click(function () {
        close_modal('manage-class');
    });
    $('#delete-log_close_id').click(function () {
        close_modal('delete-log');
    });
    $('#out-class_close_id').click(function () {
        close_modal('delete-log');
    });
    $('#edit-log_close_id').click(function () {
        close_modal('edit-log');
    });
    $('#kick-student_close_id').click(function () {
        close_modal('kick-student');
    });
    $('#delete-class_close_id').click(function () {
        close_modal('delete-class');
    });

    $('#out_class_next_btn').click(function () {
        if(document.querySelector('#out_class_next_btn').classList.contains('btn-red-disabled')) return;

        document.querySelector('#out_class-btn-loading-box').style.display = 'block';
        document.querySelector('#out_class_next_btn').classList.add('btn-red-disabled');
        document.querySelector('#out_class_next_btn').classList.remove('btn-red');

        $.ajax({
            url: `/api/class/${class_id}/me`,
            method:"DELETE",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#out_class-btn-loading-box').style.display = 'none';
                        document.querySelector('#out_class_next_btn').classList.add('btn-red');
                        document.querySelector('#out_class_next_btn').classList.remove('btn-red-disabled');

                        close_modal('out-class');
                        display_message('성공적으로 해당 클래스를 나갔습니다! 변경사항을 적용하려면 리로드하세요.', 'green');
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                if(request.status == 429) { // too many request
                    display_message('클래스 나가기를 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });
    $('#kick_student_next_btn').click(function () {
        if(document.querySelector('#kick_student_next_btn').classList.contains('btn-red-disabled')) return;

        document.querySelector('#kick_student-btn-loading-box').style.display = 'block';
        document.querySelector('#kick_student_next_btn').classList.add('btn-red-disabled');
        document.querySelector('#kick_student_next_btn').classList.remove('btn-red');

        $.ajax({
            url: `/api/class/${class_id}/user/${selected_kick_student}`,
            method:"DELETE",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#kick_student-btn-loading-box').style.display = 'none';
                        document.querySelector('#kick_student_next_btn').classList.add('btn-red');
                        document.querySelector('#kick_student_next_btn').classList.remove('btn-red-disabled');

                        close_modal('kick-student');
                        load_class_detail();
                        display_message('학생 추방을 성공했습니다!', 'green');
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                if(request.status == 429) { // too many request
                    display_message('학생 추방을 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });

    $('#edit_log_next_btn').click(function () {
        if(document.querySelector('#edit_log_next_btn').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#edit_log-btn-loading-box').style.display = 'block';
        document.querySelector('#edit_log_next_btn').classList.add('btn-blue-disabled');
        document.querySelector('#edit_log_next_btn').classList.remove('btn-blue');

        if(document.querySelectorAll('.modal-edit-log-content-box .flex').length > 100) {
            display_message('죄송합니다. 단어가 올바르지 않습니다.', 'red');
            return;
        }

        var final_put_study_log_content = [];
        for(var k = 0; k < document.querySelectorAll('.modal-edit-log-content-box .flex span').length; k++) {
            if(document.querySelectorAll('.modal-edit-log-content-box .flex span')[k].innerText.length > 50) {
                display_message('죄송합니다. 단어가 올바르지 않습니다.', 'red');
                return;
            }

            if(document.querySelectorAll('.modal-edit-log-content-box .flex .checkbox')[k].classList.contains('checkbox-focus')) {
                final_put_study_log_content.push(document.querySelectorAll('.modal-edit-log-content-box .flex span')[k].innerText);
            }
        }

        $.ajax({
            url: `/api/class/${class_id}/study_log/${selected_edit_study_log_id}`,
            method: "PUT",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock',
                log_data: final_put_study_log_content
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        load_class_detail();
                        close_modal('edit-log');
                        display_message('변경사항을 저장했어요!', 'green')
                        document.querySelector('#edit_log-btn-loading-box').style.display = 'none';
                        document.querySelector('#edit_log_next_btn').classList.add('btn-blue');
                        document.querySelector('#edit_log_next_btn').classList.remove('btn-blue-disabled');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
            }
        });
    });

    $('#delete_log_next_btn').click(function () {
        if(document.querySelector('#delete_log_next_btn').classList.contains('btn-red-disabled')) return;
        
        document.querySelector('#delete_log-btn-loading-box').style.display = 'block';
        document.querySelector('#delete_log_next_btn').classList.add('btn-red-disabled');
        document.querySelector('#delete_log_next_btn').classList.remove('btn-red');

        $.ajax({
            url: `/api/class/${class_id}/study_log/${selected_delete_study_log_id}`,
            method:"DELETE",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#delete_log-btn-loading-box').style.display = 'none';
                        document.querySelector('#delete_log_next_btn').classList.add('btn-red');
                        document.querySelector('#delete_log_next_btn').classList.remove('btn-red-disabled');

                        close_modal('delete-log');
                        load_class_detail();
                        display_message('단어장 삭제를 성공했습니다!', 'green');
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                if(request.status == 429) { // too many request
                    display_message('학습 기록 삭제를 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });

    $('.add-log-btn').click(function () {

        if(document.querySelector('.add-log-btn').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#add-log_next_btn2').style.display = 'none';
        document.querySelector('#add-log_next_btn').style.display = 'flex';

        document.querySelector('#add-log_next_btn').classList.add('btn-blue');
        document.querySelector('#add-log_next_btn').classList.remove('btn-blue-disabled');
        document.querySelector('#add-log-btn-loading-box').style.display = 'none';

        document.querySelector('.add-log-modal-end').style.display = 'block';
        document.querySelector('.modal-add-log-content1').style.display = 'block';
        document.querySelector('.modal-add-log-content2').style.display = 'none';
        document.querySelector('.modal-add-log-content3').style.display = 'none';

        document.querySelector('#add-log-check').style.display = 'none';

        document.querySelector('.modal-add-log-content1').style.right = '0px';
        document.querySelector('.modal-add-log-content1').style.opacity = '1';
        document.querySelector('.modal-add-log-content2').style.left = '20px';
        document.querySelector('.modal-add-log-content2').style.opacity = '0';
        document.querySelector('.modal-add-log-content3').style.left = '20px';
        document.querySelector('.modal-add-log-content3').style.opacity = '0';

        $.ajax({
            url: `/api/class/${class_id}`,
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#add-log-student-selected-option').innerText = result.content.students[0];
                        add_log_student_option(result.content.students[0]);

                        document.querySelector('#add-log-words-selected-option').innerText = result.content.words[0].name;
                        add_log_words_option(result.content.words[0].name, result.content.words[0].id);

                        $('#add-log-student-option-box').empty();
                        $('#add-log-words-option-box').empty();
                        for(var j = 0; j < result.content.students.length; j++) {
                            $('#add-log-student-option-box').append(`<div class="option" onclick="add_log_student_option('${result.content.students[j]}')">${result.content.students[j]}</div>`);
                        }
                        for(var j = 0; j < result.content.words.length; j++) {
                            $('#add-log-words-option-box').append(`<div class="option" onclick="add_log_words_option('${result.content.words[j].name}', '${result.content.words[j].id}')">${result.content.words[j].name}</div>`);
                        }
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                document.querySelector('#class-load-loading-box').style.display = 'none';
                if(request.status == 429) { // too many request
                    display_message('불러오기를 너무 많이 시도하셨습니다.', 'red')
                }
                else {
                    location.reload();
                }
            }
        });

        modal('add-log');
    }); 
    $('#add-log_close_id').click(function () {
        close_modal('add-log');
    });

    $('#add-log_next_btn2').click(function () {
        if(document.querySelector('#add-log_next_btn2').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#add-log-btn-loading-box2').style.display = 'block';
        document.querySelector('#add-log_next_btn2').classList.add('btn-blue-disabled');
        document.querySelector('#add-log_next_btn2').classList.remove('btn-blue');

        if(document.querySelectorAll('.modal-add-log-content2-box .flex').length > 100) {
            display_message('죄송합니다. 단어가 올바르지 않습니다.', 'red');
            return;
        }

        var final_post_study_log_content = [];
        for(var k = 0; k < document.querySelectorAll('.modal-add-log-content2-box .flex span').length; k++) {
            if(document.querySelectorAll('.modal-add-log-content2-box .flex span')[k].innerText.length > 50) {
                display_message('죄송합니다. 단어가 올바르지 않습니다.', 'red');
                return;
            }

            if(document.querySelectorAll('.modal-add-log-content2-box .flex .checkbox')[k].classList.contains('checkbox-focus')) {
                final_post_study_log_content.push(document.querySelectorAll('.modal-add-log-content2-box .flex span')[k].innerText);
            }
        }

        $.ajax({
            url: `/api/class/${class_id}/study_log`,
            method: "POST",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock',
                log_data: final_post_study_log_content,
                log_user: add_log_select_student,
                log_words_id: add_log_select_words
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        document.querySelector('.add-log-modal-end').style.display = 'none';

                        load_class_detail();
                
                        $('.modal-add-log-content2').animate({
                            opacity: '0',
                            left: '-20px'
                        }, 0, 'swing', function() {
                            $('.modal-add-log-content2').animate({
                                display: 'none'
                            }, 200, 'swing', function() {
                                document.querySelector('.modal-add-log-content2').style.display = 'none';
                                document.querySelector('.modal-add-log-content3').style.display = 'block';
                
                                $('.modal-add-log-content3').animate({
                                    opacity: '1',
                                    left: '0'
                                }, 0, 'swing', function() {
                                    if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                                        document.querySelector('#add-log-check').style.display = 'none';
                                        document.querySelector('.add-log-check-img').style.display = 'block';
                                    } else {
                                        document.querySelector('.add-log-check-img').style.display = 'none';
                                        document.querySelector('#add-log-check').style.display = 'block';
                                    }
                
                                    document.querySelector('#add-log-check').play();
                                });
                            });
                        });
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {
                display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
            }
        });
    });
    $('#add-log_next_btn').click(function () {
        document.querySelector('#add-log_next_btn').style.display = 'none';
        document.querySelector('#add-log_next_btn2').style.display = 'flex';

        document.querySelector('#add-log-btn-loading-box2').style.display = 'none';

        document.querySelector('#add-log_next_btn2').classList.add('btn-blue-disabled');
        document.querySelector('#add-log_next_btn2').classList.remove('btn-blue');

        $('.modal-add-log-content1').animate({
            opacity: '0',
            right: '20px'
        }, 0, 'swing', function() {
            $('.modal-add-log-content1').animate({
                display: 'none'
            }, 200, 'swing', function() {
                document.querySelector('.modal-add-log-content1').style.display = 'none';
                document.querySelector('.modal-add-log-content2').style.display = 'block';

                $.ajax({
                    url: `/api/words/${add_log_select_words}`,
                    method: "GET",
                    success: function(result) {
                        if (result) {
                            if(result.success == true) {
                                $('.modal-add-log-content2-box').empty();

                                for(var k = 0; k < result.content.words.length; k++) {
                                    $('.modal-add-log-content2-box').append(`<div class="flex" onclick="checkbox('add-log-${result.content.words[k][0].replace(' ', '-')}')">
                                        <div class="checkbox" id="add-log-${result.content.words[k][0].replace(' ', '-')}-checkbox">
                                            <div class="checkbox-check"></div>
                                        </div>
                                        <span style="line-height: 27px; margin: 0 0 0 10px">${result.content.words[k][0]}</span>
                                    </div>`);
                                }

                                document.querySelector('#add-log_next_btn2').classList.remove('btn-blue-disabled');
                                document.querySelector('#add-log_next_btn2').classList.add('btn-blue');
                            }
                        } else {
                            display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                        }
                    },
                    error: function(request, status, error) {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                });

                $('.modal-add-log-content2').animate({
                    opacity: '1',
                    left: '0'
                }, 0, 'swing');
            });
        });
    });

    $('.manage-class-btn').click(function () {
        document.querySelector('#refresh-invite-code-btn-loading-box').style.display = 'none';
        document.querySelector('#manage-class-btn-loading-box').style.display = 'none';
        modal('manage-class');
    });
    $('#class-invite-code-btn-copy').click(function () {
        navigator.clipboard.writeText(document.querySelector('.class-invite-code-text').innerText)
            .then(() => {
            display_message('클립보드에 초대 링크를 복사했어요!', 'green');
        })
            .catch(err => {
            display_message('클립보드 복사를 지원하지 않는 브라우저인 것 같아요! 대신 새창으로 링크를 열어드렸어요!', 'yellow');
            var win = window.open(document.querySelector('.class-invite-code-text').innerText, '_blank');
            win.focus();
        })
    });
    $('#class-invite-code-btn-refresh').click(function () {
        if(document.querySelector('#refresh-invite-code-btn-loading-box').style.display == 'block') return;

        document.querySelector('#refresh-invite-code-btn-loading-box').style.display = 'block';
        document.querySelector('#class-invite-code-btn-refresh .material-icons').style.display = 'none';

        $.ajax({
            url: `/api/class/${class_id}/invite_code`,
            method:"PUT",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#refresh-invite-code-btn-loading-box').style.display = 'none';
                        document.querySelector('#class-invite-code-btn-refresh .material-icons').style.display = 'block';

                        display_message('초대코드 재생성을 완료했어요!', 'green');
                        load_class_detail();
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                document.querySelector('#refresh-invite-code-btn-loading-box').style.display = 'none';
                document.querySelector('#class-invite-code-btn-refresh .material-icons').style.display = 'block';

                if(request.status == 429) { // too many request
                    display_message('초대코드 재생성을 너무 많이 시도하셨습니다.', 'red')
                }
                else if(request.responseJSON.message == 'You cannot refresh the class invite code more than 3 times for a day') {
                    display_message('하루에 최대 3번만 초대코드를 재생성 할 수 있어요.', 'red');
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });
    $('#manage-class_next_btn').click(function () {
        if(document.querySelector('#manage-class_next_btn').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#manage-class-btn-loading-box').style.display = 'block';
        document.querySelector('#manage-class_next_btn').classList.add('btn-blue-disabled');
        document.querySelector('#manage-class_next_btn').classList.remove('btn-blue');

        $.ajax({
            url: `/api/class/${class_id}`,
            method:"PUT",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock',
                name: document.querySelector('#edit-class-title').value,
                des: document.querySelector('#edit-class-des').value
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#manage-class-btn-loading-box').style.display = 'none';
                        document.querySelector('#manage-class_next_btn').classList.add('btn-blue');
                        document.querySelector('#manage-class_next_btn').classList.remove('btn-blue-disabled');

                        display_message('변경사항을 저장했어요!', 'green');
                        close_modal('manage-class');
                        load_class_detail();
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                if(request.status == 429) { // too many request
                    display_message('클래스 정보 저장을 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });

    $(document.querySelectorAll('#delete-class-btn')).click(function () {
        close_modal('manage-class');
        setTimeout(function(){
            document.querySelector('#delete-class-btn-loading-box').style.display = 'none';
            document.querySelector('.modal-delete-class-content1').style.display = 'block';
            document.querySelector('.modal-delete-class-content2').style.display = 'none';

            document.querySelector('.modal-delete-class-content1').style.right = '0px';
            document.querySelector('.modal-delete-class-content1').style.opacity = '1';
            document.querySelector('.modal-delete-class-content2').style.left = '20px';
            document.querySelector('.modal-delete-class-content2').style.opacity = '0';

            document.querySelector('#delete-class_next_btn').style.display = 'block';
            document.querySelector('#delete-class_next_btn2').style.display = 'none';

            document.querySelector('#confirm-class-title').value = '';
            document.querySelector('#confirm-class-title').classList.remove('input-red');

            modal('delete-class');
        }, 300);
    });

    $('#delete-class_next_btn').click(function () {

        document.querySelector('#delete-class_next_btn').style.display = 'none';
        document.querySelector('#delete-class_next_btn2').style.display = 'flex';

        $('.modal-delete-class-content1').animate({
            opacity: '0',
            right: '20px'
        }, 0, 'swing', function() {
            $('.modal-delete-class-content1').animate({
                display: 'none'
            }, 200, 'swing', function() {
                document.querySelector('.modal-delete-class-content1').style.display = 'none';
                document.querySelector('.modal-delete-class-content2').style.display = 'block';

                $('.modal-delete-class-content2').animate({
                    opacity: '1',
                    left: '0'
                }, 0, 'swing');
            });
        });
    });
    $('#delete-class_next_btn2').click(function () {
        if(document.querySelector('#delete-class_next_btn2').classList.contains('btn-red-disabled')) return;

        if(document.querySelector('.class_name').innerText != '> ' + document.querySelector('#confirm-class-title').value) {
            document.querySelector('#confirm-class-title').classList.add('input-red');
            return;
        } else {
            document.querySelector('#confirm-class-title').classList.remove('input-red');
        }

        document.querySelector('#delete-class-btn-loading-box').style.display = 'block';
        document.querySelector('#delete-class_next_btn2').classList.add('btn-red-disabled');
        document.querySelector('#delete-class_next_btn2').classList.remove('btn-red');

        $.ajax({
            url: `/api/class/${class_id}`,
            method:"DELETE",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Content-type","application/json");
            },
            data: JSON.stringify({
                key: 'Shock'
            }),
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#delete-class-btn-loading-box').style.display = 'none';
                        document.querySelector('#delete-class_next_btn2').classList.add('btn-red');
                        document.querySelector('#delete-class_next_btn2').classList.remove('btn-red-disabled');

                        display_message('클래스를 영구적으로 삭제했습니다! 변경사항을 적용하려면 리로드하세요.', 'green');
                        close_modal('delete-class');
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                if(request.status == 429) { // too many request
                    display_message('클래스 정보 저장을 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });

    });

    $('html').click(function(e) {
        if(!$(e.target).hasClass('add-log-student-option-box') && !$(e.target).hasClass('add-log-student-select') && !$(e.target).hasClass('add-log-student-selected-option') && !$(e.target).hasClass('add-log-student-select-arrow')  && !$(e.target).hasClass('option-disabled')) {
            close_select('add-log-student');
        }
        if(!$(e.target).hasClass('add-log-words-option-box') && !$(e.target).hasClass('add-log-words-select') && !$(e.target).hasClass('add-log-words-selected-option') && !$(e.target).hasClass('add-log-words-select-arrow')  && !$(e.target).hasClass('option-disabled')) {
            close_select('add-log-words');
        }
    });
});