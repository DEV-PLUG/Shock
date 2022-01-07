$(".home-menu-box").load("/views/partials/dashboard-menu.html");

var words_class_id = 'personal';
function words_class_option(name, id) {
    option('words-class', `${name}`);
    words_class_id = id;
}

$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');

    $('#custom-mean-checkbox-flex').click(function () {
        checkbox('custom-mean');
        if(document.querySelector('#custom-mean-checkbox').classList.contains('checkbox-focus')) {
            for(var q = 0; q < document.querySelectorAll('.words-mean').length; q++) {
                document.querySelectorAll('.words-mean')[q].style.display = 'block';
            }
        } else {
            for(var q = 0; q < document.querySelectorAll('.words-mean').length; q++) {
                document.querySelectorAll('.words-mean')[q].style.display = 'none';
            }
        }
    });

    $('.add-words-btn2').click(function () {
        document.querySelector('#add-words-btn-loading-box').style.display = 'none';
        document.querySelector('#words-title').value = '';
        document.querySelector('#words-count').value = '1';

        document.querySelector('#words-title').classList.remove('input-red');
        document.querySelector('#words-count').classList.remove('input-red');

        document.querySelector('#custom-mean-checkbox').classList.remove('checkbox-focus');

        $('.words-text-box').empty();
        $('.words-text-box').append('<input type="text" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="words-text" autocomplete="off">');
        $('.words-text-box').append('<input type="text" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="words-mean" autocomplete="off" style="display: none;">');

        document.querySelector('.add-words-modal-end').style.display = 'block';
        document.querySelector('.modal-add-words-content1').style.display = 'block';
        document.querySelector('.modal-add-words-content2').style.display = 'none';

        document.querySelector('#create_words_next_btn').classList.add('btn-blue');
        document.querySelector('#create_words_next_btn').classList.remove('btn-blue-disabled');
        document.querySelector('#add-words-btn-loading-box').style.display = 'none';

        document.querySelector('#add-words-check').style.display = 'none';

        document.querySelector('.modal-add-words-content1').style.right = '0px';
        document.querySelector('.modal-add-words-content1').style.opacity = '1';
        document.querySelector('.modal-add-words-content2').style.left = '20px';
        document.querySelector('.modal-add-words-content2').style.opacity = '0';

        modal('create-words');

        option('words-class', `개인 단어장 보관함`);

        $.ajax({
            url: "/api/class",
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        $('#words-class-option-box').empty();
                        $('#words-class-option-box').append(`<div class="option" onclick="words_class_option('개인 단어장 보관함', 'personal')">개인 단어장 보관함</div>`);

                        if(result.content.owner_class != null && result.content.owner_class.length != 0) {
                            for(var j = 0; j < result.content.owner_class.length; j++) {
                                $('#words-class-option-box').append(`<div class="option" onclick="words_class_option('${result.content.owner_class[j].name}', '${result.content.owner_class[j].id}')">${result.content.owner_class[j].name}</div>`);
                            }
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
    });
    $('.add-words-btn').click(function () {
        document.querySelector('#add-words-btn-loading-box').style.display = 'none';
        document.querySelector('#words-title').value = '';
        document.querySelector('#words-count').value = '1';

        document.querySelector('#words-title').classList.remove('input-red');
        document.querySelector('#words-count').classList.remove('input-red');

        document.querySelector('#custom-mean-checkbox').classList.remove('checkbox-focus');

        $('.words-text-box').empty();
        $('.words-text-box').append('<input type="text" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="words-text" autocomplete="off">');
        $('.words-text-box').append('<input type="text" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="words-mean" autocomplete="off" style="display: none;">');

        document.querySelector('.add-words-modal-end').style.display = 'block';
        document.querySelector('.modal-add-words-content1').style.display = 'block';
        document.querySelector('.modal-add-words-content2').style.display = 'none';

        document.querySelector('#create_words_next_btn').classList.add('btn-blue');
        document.querySelector('#create_words_next_btn').classList.remove('btn-blue-disabled');
        document.querySelector('#add-words-btn-loading-box').style.display = 'none';

        document.querySelector('#add-words-check').style.display = 'none';

        document.querySelector('.modal-add-words-content1').style.right = '0px';
        document.querySelector('.modal-add-words-content1').style.opacity = '1';
        document.querySelector('.modal-add-words-content2').style.left = '20px';
        document.querySelector('.modal-add-words-content2').style.opacity = '0';

        modal('create-words');

        option('words-class', `개인 단어장 보관함`);

        $.ajax({
            url: "/api/class",
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        $('#words-class-option-box').empty();
                        $('#words-class-option-box').append(`<div class="option" onclick="words_class_option('개인 단어장 보관함', 'personal')">개인 단어장 보관함</div>`);

                        if(result.content.owner_class != null && result.content.owner_class.length != 0) {
                            for(var j = 0; j < result.content.owner_class.length; j++) {
                                $('#words-class-option-box').append(`<div class="option" onclick="words_class_option('${result.content.owner_class[j].name}', '${result.content.owner_class[j].id}')">${result.content.owner_class[j].name}</div>`);
                            }
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
    });

    $('#create-words_close_id').click(function () {
        close_modal('create-words');
    });

    $('html').click(function(e) {
        if(!$(e.target).hasClass('words-class-option-box') && !$(e.target).hasClass('words-class-select') && !$(e.target).hasClass('words-class-selected-option') && !$(e.target).hasClass('words-class-select-arrow')  && !$(e.target).hasClass('option-disabled')) {
            close_select('words-class');
        }
    });

    var selected_words_id;
    function load_words() {
        document.querySelector('#words-load-loading-box').style.display = 'block';
        document.querySelector('.no-words').style.display = 'none';

        $('.words-box-wrap').empty();

        $.ajax({
            url: "/api/words",
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        document.querySelector('#words-load-loading-box').style.display = 'none';

                        if(result.content.personal != null && result.content.personal.length > 0) {
                            $('.words-box-wrap').append('<div class="words_wrap_title">개인 단어장</div>');
                            for(var j = 0; j < result.content.personal.length; j++) {
                                $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.personal[j].title}</div><div class="words-box-content-des">${result.content.personal[j].words.length}개의 단어</div></div><div class="flex"><div class="words-content-btn words-content-btn-share" id="${result.content.personal[j].id}"><span class="material-icons words-content-btn-icon">share</span></div><div class="words-content-btn words-content-btn-edit" id="${result.content.personal[j].id}"><span class="material-icons words-content-btn-icon">edit</span></div><div class="words-content-btn words-content-btn-delete" id="${result.content.personal[j].id}"><span class="material-icons words-content-btn-icon words-content-btn-delete-icon">delete</span></div></div></div></div>`);
                            }
                        }
                        if(result.content.owner != null && result.content.owner.length > 0) {
                            for(var j = 0; j < result.content.owner.length; j++) {
                                if(result.content.owner[j].words.length > 0) {
                                    $('.words-box-wrap').append(`<div class="words_wrap_title">소유한 클래스 - ${result.content.owner[j].name}</div>`);
                                    for(var i = 0; i < result.content.owner[j].words.length; i++) {
                                        $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.owner[j].words[i].title}</div><div class="words-box-content-des">${result.content.owner[j].words[i].words.length}개의 단어</div></div><div class="flex"><div class="words-content-btn words-content-btn-share" id="${result.content.owner[j].words[i].id}"><span class="material-icons words-content-btn-icon">share</span></div><div class="words-content-btn words-content-btn-edit" id="${result.content.owner[j].words[i].id}"><span class="material-icons words-content-btn-icon">edit</span></div><div class="words-content-btn words-content-btn-delete" id="${result.content.owner[j].words[i].id}"><span class="material-icons words-content-btn-icon words-content-btn-delete-icon">delete</span></div></div></div></div>`);
                                    }
                                }
                            }
                        }
                        if(result.content.user != null && result.content.user.length > 0) {
                            for(var j = 0; j < result.content.user.length; j++) {
                                if(result.content.user[j].words.length > 0) {
                                    $('.words-box-wrap').append(`<div class="words_wrap_title">참여한 클래스 - ${result.content.user[j].name}</div>`);
                                    for(var i = 0; i < result.content.user[j].words.length; i++) {
                                        $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.user[j].words[i].title}</div><div class="words-box-content-des">${result.content.user[j].words[i].words.length}개의 단어</div></div><div class="flex"><div class="words-content-btn words-content-btn-share" id="${result.content.user[j].words[i].id}"><span class="material-icons words-content-btn-icon">share</span></div></div></div></div>`);
                                    }
                                }
                            }
                        }

                        if(document.querySelectorAll('.words-box-content').length <= 0) {
                            document.querySelector('.no-words').style.display = 'block';
                        }

                        $(document.querySelectorAll('.words-content-btn-edit')).click(function () {
                            $(".message-box2").append(`<div class="message-content2"><div class="flex-center"><div class="btn-loading-box" style="margin: 7px;"><div class="btn-loading-circle"></div></div><div class="message-content-text2">단어장 정보를 불러오고 있습니다, 잠시만 기다려 주세요.</div></div></div>`);
                            $(document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1]).animate({
                                bottom: '40px',
                                opacity: '1'
                            }, 100);
                            const message_content_el2 = document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1];

                            document.querySelector('#edit-words-btn-loading-box').style.display = 'none';

                            document.querySelector('#edit_words_next_btn').classList.add('btn-blue');
                            document.querySelector('#edit_words_next_btn').classList.remove('btn-blue-disabled');

                            selected_words_id = $(this).attr("id");
                            $.ajax({
                                url: `/api/words/${selected_words_id}`,
                                method: "GET",
                                success: function(result) {
                                    if (result) {
                                        if(result.success == true) {
                                            document.querySelector('#edit-words-title').value = result.content.title;
                                            $('.edit-words-text-box').empty();
                                            document.querySelector('.words-content-btn-edit-add').remove();
                                            $('.edit-words_input_box').append('<div class="words-content-btn words-content-btn-edit-add"><span class="material-icons words-content-btn-icon">add</span></div>');

                                            for(var k = 0; k < result.content.words.length; k++) {
                                                if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                                                    $('.edit-words-text-box').append(`<div class="flex-between"><div style="width: 85%;"><input style="width: 100% !important;" type="text" value="${result.content.words[k][0]}" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="edit-words-text" autocomplete="off"><input style="width: 100% !important;" type="text" value="${result.content.words[k][1]}" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="edit-words-mean" autocomplete="off"></div><div class="words-content-btn words-content-btn-edit-delete" id="${k}"><span class="material-icons words-content-btn-icon">delete</span></div></div>`);
                                                } else {
                                                    $('.edit-words-text-box').append(`<div class="flex-between"><div style="width: 405px;"><input type="text" value="${result.content.words[k][0]}" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="edit-words-text" autocomplete="off"><input type="text" value="${result.content.words[k][1]}" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="edit-words-mean" autocomplete="off"></div><div class="words-content-btn words-content-btn-edit-delete" id="${k}"><span class="material-icons words-content-btn-icon">delete</span></div></div>`);
                                                }
                                            }
                                            modal('edit-words');

                                            $(document.querySelector('.words-content-btn-edit-add')).click(function () {
                                                if(document.querySelectorAll('.edit-words-text-box .flex-between').length >= 100) return display_message('단어는 100개 이하여야 해요!', 'yellow');
                                                if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                                                    $('.edit-words-text-box').append(`<div class="flex-between"><div style="width: 85%;"><input type="text" style="width: 100% !important;" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="edit-words-text" autocomplete="off"><input type="text" style="width: 100% !important;" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="edit-words-mean" autocomplete="off"></div><div class="words-content-btn words-content-btn-edit-delete" id="${k++}"><span class="material-icons words-content-btn-icon">delete</span></div></div>`);
                                                } else {
                                                    $('.edit-words-text-box').append(`<div class="flex-between"><div style="width: 405px;"><input type="text" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="edit-words-text" autocomplete="off"><input type="text" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="edit-words-mean" autocomplete="off"></div><div class="words-content-btn words-content-btn-edit-delete" id="${k++}"><span class="material-icons words-content-btn-icon">delete</span></div></div>`);
                                                }

                                                $(document.querySelectorAll('.words-content-btn-edit-delete')[document.querySelectorAll('.words-content-btn-edit-delete').length - 1]).click(function () {
                                                    if(document.querySelectorAll('.words-content-btn-edit-delete').length <= 1) {
                                                        return display_message('단어는 한개 이상이어야 해요!', 'yellow');
                                                    }
    
                                                    for(var o = 0; o < document.querySelectorAll('.words-content-btn-edit-delete').length; o++) {
                                                        if($(this).attr('id') == document.querySelectorAll('.words-content-btn-edit-delete')[o].id) break;
                                                    }
                                                    document.querySelectorAll('.edit-words-text-box .flex-between')[o].remove();
                                                });
                                            });
                                            $(document.querySelectorAll('.words-content-btn-edit-delete')).click(function () {
                                                if(document.querySelectorAll('.words-content-btn-edit-delete').length <= 1) {
                                                    return display_message('단어는 한개 이상이어야 해요!', 'yellow');;
                                                }

                                                for(var o = 0; o < document.querySelectorAll('.words-content-btn-edit-delete').length; o++) {
                                                    if($(this).attr('id') == document.querySelectorAll('.words-content-btn-edit-delete')[o].id) break;
                                                }
                                                document.querySelectorAll('.edit-words-text-box .flex-between')[o].remove();
                                            });
                                            
                                            $(message_content_el2).remove();
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
                        $(document.querySelectorAll('.words-content-btn-delete')).click(function () {
                            document.querySelector('#delete_words-btn-loading-box').style.display = 'none';

                            selected_words_id = $(this).attr("id");
                            $.ajax({
                                url: `/api/words/${selected_words_id}`,
                                method: "GET",
                                success: function(result) {
                                    if (result) {
                                        if(result.success == true) {
                                            document.querySelector('.modal-warn-title').innerText = `${result.content.title}\n단어장을\n삭제하시겠어요?`
                                            modal('delete-words');
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
                        $(document.querySelectorAll('.words-content-btn-share')).click(function () {
                            navigator.clipboard.writeText(`https://shock-english.ml/dashboard/words/share/${$(this).attr("id")}`)
                                .then(() => {
                                display_message('클립보드에 공유 링크를 복사했어요!', 'green');
                            })
                                .catch(err => {
                                display_message('클립보드 복사를 지원하지 않는 브라우저인 것 같아요! 대신 새창으로 링크를 열어드렸어요!', 'yellow');
                                var win = window.open(`https://shock-english.ml/dashboard/words/share/${$(this).attr("id")}`, '_blank');
                                win.focus();
                            })
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
    }
    load_words();

    $('#delete_words_next_btn').click(function () {
        document.querySelector('#delete_words-btn-loading-box').style.display = 'block';
        document.querySelector('#delete_words_next_btn').classList.add('btn-red-disabled');
        document.querySelector('#delete_words_next_btn').classList.remove('btn-red');

        $.ajax({
            url: `/api/words/${selected_words_id}`,
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
                        document.querySelector('#delete_words-btn-loading-box').style.display = 'none';
                        document.querySelector('#delete_words_next_btn').classList.add('btn-red');
                        document.querySelector('#delete_words_next_btn').classList.remove('btn-red-disabled');

                        close_modal('delete-words');
                        load_words();
                        display_message('단어장 삭제를 성공했습니다!', 'green');
                    } else {
                        display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                    }
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                }
            },
            error: function(request, status, error) {

                document.querySelector('#delete_words-btn-loading-box').style.display = 'none';
                document.querySelector('#delete_words_next_btn').classList.add('btn-red');
                document.querySelector('#delete_words_next_btn').classList.remove('btn-red-disabled');

                if(request.status == 429) { // too many request
                    display_message('단어장 삭제를 너무 많이 시도하셨습니다.', 'red')
                } else {
                    display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                }

            }
        });
    });

    $('#delete-words_close_id').click(function () {
        close_modal('delete-words');
    });
    $('#edit-words_close_id').click(function () {
        close_modal('edit-words');
    });

    var words_text_final = [];
    var edit_words_text_final = [];
    const eng = /^[a-zA-Z\s]*$/; 
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]+$/;

    $('#edit_words_next_btn').click(function () {
        if(document.querySelector('#edit_words_next_btn').classList.contains('btn-blue-disabled')) return;

        if(!regex.test(document.querySelector('#edit-words-title').value) || document.querySelector('#edit-words-title').value == '' || document.querySelector('#edit-words-title').value.length > 20) {
            document.querySelector('#edit-words-title').classList.add('input-red');
        } else {
            edit_words_text_final = [];

            for(var q = 0; q < document.querySelectorAll('.edit-words-text').length; q++) {
                if(document.querySelectorAll('.edit-words-text')[q].value == '' || document.querySelectorAll('.edit-words-text')[q].value.length > 50) document.querySelectorAll('.edit-words-text')[q].classList.add('input-red');
                else if(!eng.test(document.querySelectorAll('.edit-words-text')[q].value)) {
                    document.querySelectorAll('.edit-words-text')[q].classList.add('input-red');
                }
                else {
                    for(var i = 0; i < edit_words_text_final.length; i++) {
                        if(edit_words_text_final[i][0] == document.querySelectorAll('.edit-words-text')[q].value) {
                            display_message('중복된 단어를 확인해주세요.', 'yellow');
                            break;
                        }
                    }
                    if(i != edit_words_text_final.length) continue;

                    document.querySelectorAll('.edit-words-text')[q].classList.remove('input-red');
                    edit_words_text_final.push([ document.querySelectorAll('.edit-words-text')[q].value, document.querySelectorAll('.edit-words-mean')[q].value ]);
                }
            }

            if(edit_words_text_final.length == document.querySelectorAll('.edit-words-text').length) {

                document.querySelector('#edit_words_next_btn').classList.remove('btn-blue');
                document.querySelector('#edit_words_next_btn').classList.add('btn-blue-disabled');
                document.querySelector('#edit-words-btn-loading-box').style.display = 'block';

                $.ajax({
                    url:`/api/words/${selected_words_id}`,
                    method:"PUT",
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("Content-type","application/json");
                    },
                    data: JSON.stringify({
                        key: 'Shock',
                        words_title: document.querySelector('#edit-words-title').value,
                        words_text: edit_words_text_final
                    }),
                    success: function(result) {
                        if (result) {
                            if(result.success == true) {
                                document.querySelector('#edit-words-btn-loading-box').style.display = 'none';
                                load_words();
                                display_message('변경사항을 저장했어요!', 'green')

                                close_modal('edit-words');
                            } else {
                                display_message('알 수 없는 오류가 발생했습니다.(2)', 'red');
                            }
                        } else {
                            display_message('알 수 없는 오류가 발생했습니다.(1)', 'red');
                        }
                    },
                    error: function(request, status, error) {

                        document.querySelector('#create_words_next_btn').classList.add('btn-blue');
                        document.querySelector('#create_words_next_btn').classList.remove('btn-blue-disabled');
                        document.querySelector('#add-words-btn-loading-box').style.display = 'none';

                        if(request.status == 429) { // too many request
                            display_message('단어장 수정을 너무 많이 시도하셨습니다.', 'red')
                        }
                        else if(request.responseJSON.message == 'There is no change') display_message('변경사항이 없습니다.', 'red')
                        else if(request.responseJSON.message == 'Title must include only English, Korean and number') document.querySelector('#words-title').classList.add('input-red');
                        else {
                            display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                        }
                    }
                });
            }
        }
    });

    $('#create_words_next_btn').click(function () {
        if(document.querySelector('#create_words_next_btn').classList.contains('btn-blue-disabled')) return;

        if(!regex.test(document.querySelector('#words-title').value) || document.querySelector('#words-count').value == '' || document.querySelector('#words-title').value == '' || document.querySelector('#words-title').value.length > 20 || parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) > 100 || parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) <= 0) {
            if(!regex.test(document.querySelector('#words-title').value) || document.querySelector('#words-title').value == '' || document.querySelector('#words-title').value.length > 20) {
                document.querySelector('#words-title').classList.add('input-red');
            }
            if(document.querySelector('#words-count').value == '' || parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) > 100 || parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) <= 0) {
                document.querySelector('#words-count').classList.add('input-red');
            }
        } else {
            words_text_final = [];
            var words_create_text_length = document.querySelectorAll('.words-text').length;

            for(var j = 0; j < document.querySelectorAll('.words-text').length; j++) {
                if((document.querySelectorAll('.words-text')[j].value == '' && document.querySelectorAll('.words-text').length == 1) || document.querySelectorAll('.words-text')[j].value.length > 50) document.querySelectorAll('.words-text')[j].classList.add('input-red');
                else if(!eng.test(document.querySelectorAll('.words-text')[j].value)) {
                    document.querySelectorAll('.words-text')[j].classList.add('input-red');
                } 
                else if(document.querySelectorAll('.words-text')[j].value == '') {
                    document.querySelectorAll('.words-text')[j].classList.remove('input-red');
                    words_create_text_length--;
                    continue;
                }
                else {
                    for(var q = 0; q < words_text_final.length; q++) {
                        if(words_text_final[q][0] == document.querySelectorAll('.words-text')[j].value) {
                            display_message('중복된 단어를 확인해주세요.', 'yellow');
                            break;
                        }
                    }
                    if(q != words_text_final.length) continue;

                    document.querySelectorAll('.words-text')[j].classList.remove('input-red');
                    words_text_final.push([ document.querySelectorAll('.words-text')[j].value, document.querySelectorAll('.words-mean')[j].value ]);
                }
            }

            if(words_text_final.length == words_create_text_length) {

                document.querySelector('#create_words_next_btn').classList.remove('btn-blue');
                document.querySelector('#create_words_next_btn').classList.add('btn-blue-disabled');
                document.querySelector('#add-words-btn-loading-box').style.display = 'block';

                $.ajax({
                    url:"/api/words",
                    method:"POST",
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("Content-type","application/json");
                    },
                    data: JSON.stringify({
                        key: 'Shock',
                        words_title: document.querySelector('#words-title').value,
                        words_text: words_text_final,
                        words_class: words_class_id
                    }),
                    success: function(result) {
                        if (result) {
                            if(result.success == true) {
                                document.querySelector('#add-words-btn-loading-box').style.display = 'none';
                                document.querySelector('.add-words-modal-end').style.display = 'none';

                                load_words();
                        
                                $('.modal-add-words-content1').animate({
                                    opacity: '0',
                                    right: '20px'
                                }, 0, 'swing', function() {
                                    $('.modal-add-words-content1').animate({
                                        display: 'none'
                                    }, 200, 'swing', function() {
                                        document.querySelector('.modal-add-words-content1').style.display = 'none';
                                        document.querySelector('.modal-add-words-content2').style.display = 'block';
                        
                                        $('.modal-add-words-content2').animate({
                                            opacity: '1',
                                            left: '0'
                                        }, 0, 'swing', function() {
                                            document.querySelector('#add-words-check').style.display = 'block';

                                            if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                                                document.querySelector('#add-words-check').style.display = 'none';
                                            } else {
                                                document.querySelector('.add-words-check-img').style.display = 'none';
                                            }

                                            document.querySelector('#add-words-check').play();
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

                        document.querySelector('#create_words_next_btn').classList.add('btn-blue');
                        document.querySelector('#create_words_next_btn').classList.remove('btn-blue-disabled');
                        document.querySelector('#add-words-btn-loading-box').style.display = 'none';

                        if(request.status == 429) { // too many request
                            display_message('단어장 생성을 너무 많이 시도하셨습니다.', 'red')
                        }
                        else if(request.responseJSON.message == 'The user cannot make words more then 20') display_message('단어장은 한 유저당 최대 20개까지만 생성 가능해요.', 'red');
                        else if(request.responseJSON.message == 'Title must include only English, Korean and number') document.querySelector('#words-title').classList.add('input-red');
                        else if(result.code == 500) display_message('알 수 없는 오류가 발생했습니다.(4)', 'red');
                        else {
                            display_message('알 수 없는 오류가 발생했습니다.(5)', 'red');
                        }
                    }
                });
            }
        }
    });

    $("#words-title").on("propertychange change keyup paste input", function() {
		document.querySelector('#words-title').classList.remove('input-red');
	});
    $("#words-count").on("propertychange change keyup paste input", function() {
		document.querySelector('#words-count').classList.remove('input-red');

        $('.words-text-box').empty();

        if(parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) > 100) document.querySelector('#words-count').value = '100';
        else if(parseInt(document.querySelector('#words-count').value.replace(/[^0-9]/g, "")) <= 0) document.querySelector('#words-count').value = '1';
        else document.querySelector('#words-count').value = document.querySelector('#words-count').value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        for(var i = 0; i < parseInt(document.querySelector('#words-count').value); i++) {
            $('.words-text-box').append('<input type="text" placeholder="영단어를 입력해주세요.(최대 50자)" maxlength="50" class="words-text" autocomplete="off">');
            if(document.querySelector('#custom-mean-checkbox').classList.contains('checkbox-focus')) {
                $('.words-text-box').append('<input type="text" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="words-mean" autocomplete="off">');
            } else {
                $('.words-text-box').append('<input type="text" placeholder="뜻을 입력해주세요. 원하지 않다면 비워두세요.(최대 20자)" maxlength="20" class="words-mean" autocomplete="off" style="display: none;">');
            }
        }
	});
});