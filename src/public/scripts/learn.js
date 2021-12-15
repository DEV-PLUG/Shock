$(document).ready(function () {
    $(".home-menu-box").load("/views/partials/dashboard-menu.html");

    var select_learn_id, select_print_id;
    function load_words() {
        document.querySelector('#words-load-loading-box').style.display = 'block';
        document.querySelector('.no-words').style.display = 'none';

        $.ajax({
            url: "/api/words",
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        document.querySelector('#words-load-loading-box').style.display = 'none';
                        $('.words-box-wrap').empty();

                        if(result.content == null) {
                            document.querySelector('.no-words').style.display = 'block';
                        } else {
                            for(var j = 0; j < result.content.length; j++) {
                                $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content[j].title}</div><div class="words-box-content-des">${result.content[j].words.length}개의 단어</div></div><div class="flex"><div class="words-box-content-btn2" id="${result.content[j].id}">출력하기</div><div class="words-box-content-btn" id="${result.content[j].id}">학습하기</div></div></div></div>`);
                            }
                        }

                        $(document.querySelectorAll('.words-box-content-btn')).click(function () {
                            select_learn_id = $(this).attr('id');
                            radio('select-learn-type', 'select-learn-type1')
                            modal('learn-words');
                        });
                        $(document.querySelectorAll('.words-box-content-btn2')).click(function () {
                            select_print_id = $(this).attr('id');
                            radio('select-print-type', 'select-print-type1')
                            modal('print-words');
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

    $('.add-words-btn2').click(function () {
        location.href = '/dashboard/words';
    });
    $('#learn-words_close_id').click(function () {
        close_modal('learn-words');
    });
    $('#print-words_close_id').click(function () {
        close_modal('print-words');
    });
    
    $('#learn_words_next_btn').click(function () {
        if(document.querySelector('#select-learn-type1').classList.contains('radio-focus')) {
            location.href = `/dashboard/learn/${select_learn_id}?type=words`;
        } else if(document.querySelector('#select-learn-type4').classList.contains('radio-focus')) {
            location.href = `/dashboard/learn/${select_learn_id}?type=test`
        }
    });
    $('#print_words_next_btn').click(function () {
        if(document.querySelector('#select-print-type1').classList.contains('radio-focus')) {
            location.href = `/table/${select_print_id}`;
        } else if(document.querySelector('#select-print-type2').classList.contains('radio-focus')) {
            location.href = `/table/${select_print_id}?type=ko`;
        } else if(document.querySelector('#select-print-type3').classList.contains('radio-focus')) {
            location.href = `/table/${select_print_id}?type=en`;
        }
    });

});