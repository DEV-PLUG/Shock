$(".home-menu-box").load("/views/partials/dashboard-menu.html");

$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    gtag('config', 'G-SWDY51DRVB');

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

                        if(result.content.personal != null && result.content.personal.length > 0) {
                            $('.words-box-wrap').append('<div class="words_wrap_title">개인 단어장</div>');
                            for(var j = 0; j < result.content.personal.length; j++) {
                                $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.personal[j].title}</div><div class="words-box-content-des">${result.content.personal[j].words.length}개의 단어</div></div><div class="flex"><div class="words-box-content-btn2" id="${result.content.personal[j].id}">출력하기</div><div class="words-box-content-btn" id="${result.content.personal[j].id}">학습하기</div></div></div></div>`);
                            }
                        }
                        if(result.content.owner != null && result.content.owner.length > 0) {
                            for(var j = 0; j < result.content.owner.length; j++) {
                                if(result.content.owner[j].words.length > 0) {
                                    $('.words-box-wrap').append(`<div class="words_wrap_title">소유한 클래스 - ${result.content.owner[j].name}</div>`);
                                    for(var i = 0; i < result.content.owner[j].words.length; i++) {
                                        $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.owner[j].words[i].title}</div><div class="words-box-content-des">${result.content.owner[j].words[i].words.length}개의 단어</div></div><div class="flex"><div class="words-box-content-btn2" id="${result.content.owner[j].words[i].id}">출력하기</div><div class="words-box-content-btn" id="${result.content.owner[j].words[i].id}">학습하기</div></div></div></div>`);
                                    }
                                }
                            }
                        }
                        if(result.content.user != null && result.content.user.length > 0) {
                            for(var j = 0; j < result.content.user.length; j++) {
                                if(result.content.user[j].words.length > 0) {
                                    $('.words-box-wrap').append(`<div class="words_wrap_title">참여한 클래스 - ${result.content.user[j].name}</div>`);
                                    for(var i = 0; i < result.content.user[j].words.length; i++) {
                                        $('.words-box-wrap').append(`<div class="words-box-content"><div class="flex-between"><div class="flex"><div class="words-box-content-title">${result.content.user[j].words[i].title}</div><div class="words-box-content-des">${result.content.user[j].words[i].words.length}개의 단어</div></div><div class="flex"><div class="words-box-content-btn" id="${result.content.user[j].words[i].id}">학습하기</div></div></div></div>`);
                                    }
                                }
                            }
                        }

                        if(document.querySelectorAll('.words-box-content').length <= 0) {
                            document.querySelector('.no-words').style.display = 'block';
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
        } else if(document.querySelector('#select-learn-type2').classList.contains('radio-focus')) {
            location.href = `/dashboard/learn/${select_learn_id}?type=words-ko`
        } else if(document.querySelector('#select-learn-type3').classList.contains('radio-focus')) {
            location.href = `/dashboard/learn/${select_learn_id}?type=words-en`
        }
    });
    $('#print_words_next_btn').click(function () {
        if(document.querySelector('#print_words_next_btn').classList.contains('btn-blue-disabled')) return;

        var words_type;

        if(document.querySelector('#select-print-type1').classList.contains('radio-focus')) {
            words_type = 'default';
        } else if(document.querySelector('#select-print-type2').classList.contains('radio-focus')) {
            words_type = 'ko';
        } else if(document.querySelector('#select-print-type3').classList.contains('radio-focus')) {
            words_type = 'en';
        }

        $.ajax({
            url: `/api/words/${select_print_id}`,
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {

                        document.querySelector('#print_words_next_btn').classList.add('btn-blue-disabled');
                        document.querySelector('#print_words_next_btn').classList.remove('btn-blue');

                        $('table').empty();

                        $(".message-box2").append(`<div class="message-content2"><div class="flex-center"><div class="btn-loading-box" style="margin: 7px;"><div class="btn-loading-circle"></div></div><div class="message-content-text2">PDF 문서를 준비하고 있습니다, 잠시만 기다려 주세요.</div></div></div>`);
                        $(document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1]).animate({
                            bottom: '40px',
                            opacity: '1'
                        }, 100);
                        const message_content_el2 = document.querySelectorAll('.message-content2')[document.querySelectorAll('.message-content2').length-1];
    
                        $('table').append(`<div class="slice"><h1 class="th">-</h1></div>`);
                        document.querySelector('h1').innerText = result.content.title;
                        for(var k = 0; k < 18; k++) {
                            if(result.content.words[k] == undefined) break;
                            if(words_type == 'ko') $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td>${result.content.words[k][1]}</td></tr>`);
                            else if(words_type == 'en') $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td>${result.content.words[k][0]}</td></tr>`);
                            else $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td style="width: 40%;">${result.content.words[k][0]}</td><td>${result.content.words[k][1]}</td></tr>`);
                        }
    
                        for(var j = 1; j < parseInt(result.content.words.length / 20) + 1; j++) {
                            $('table').append(`<div class="slice"></div>`);
                            for(var k = 18 + 20 * (j - 1); k < 18 + 20 * (j - 1) + 20; k++) {
                                if(result.content.words[k] == undefined) break;
                                if(words_type == 'ko') $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td>${result.content.words[k][1]}</td></tr>`);
                                else if(words_type == 'en') $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td>${result.content.words[k][0]}</td></tr>`);
                                else $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td style="width: 40%;">${result.content.words[k][0]}</td><td>${result.content.words[k][1]}</td></tr>`);
                            }
                        }

                        close_modal('print-words');

                        // 모바일 기기 인식
                        if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
                            $('table').empty();
                            document.querySelector('#print_words_next_btn').classList.remove('btn-blue-disabled');
                            document.querySelector('#print_words_next_btn').classList.add('btn-blue');
                            $(message_content_el2).animate({
                                opacity: '0'
                            }, 100, function() {
                                $(message_content_el2).remove();
                                display_message('죄송합니다. 해당 기기에서는 PDF 저장을 지원하지 않습니다.', 'red');
                            });
                            return;
                        }

                        document.querySelector('table').style.opacity = '1';
                        const pdf_obejct_set = document.querySelectorAll('.slice');
                        document.querySelector('table').style.opacity = '0';
    
                        var doc = new jsPDF('p', 'mm', 'a4'); //jspdf객체 생성
                        var imgData;
                        var print_index = 1;
                        html2canvas($(pdf_obejct_set[0])[0]).then(function(canvas) {
                            imgData = canvas.toDataURL('image/png'); //캔버스를 이미지로 변환
                            doc.addImage(imgData, 'PNG', 0, 0); //이미지를 기반으로 pdf생성
    
                            if(pdf_obejct_set.length == 1) {
                                doc.save(`${result.content.title} - Shock 단어장.pdf`); //pdf저장
                                $('table').empty();
                                document.querySelector('#print_words_next_btn').classList.remove('btn-blue-disabled');
                                document.querySelector('#print_words_next_btn').classList.add('btn-blue');
                                $(message_content_el2).animate({
                                    opacity: '0'
                                }, 100, function() {
                                    $(message_content_el2).remove();
                                    display_message('PDF 문서 저장을 완료했습니다!', 'green');
                                });
                            }
    
                            for(var q = 1; q < pdf_obejct_set.length; q++) {
                                html2canvas($(pdf_obejct_set[q])[0]).then(function(canvas) {
                                    doc.addPage();
                                    print_index++;
                                    imgData = canvas.toDataURL('image/png'); //캔버스를 이미지로 변환
                                    doc.addImage(imgData, 'PNG', 0, 0); //이미지를 기반으로 pdf생성
    
                                    if(print_index == pdf_obejct_set.length) {
                                        doc.save(`${result.content.title} - Shock 단어장.pdf`); //pdf저장
                                        $('table').empty();
                                        document.querySelector('#print_words_next_btn').classList.remove('btn-blue-disabled');
                                        document.querySelector('#print_words_next_btn').classList.add('btn-blue');
                                        $(message_content_el2).animate({
                                            opacity: '0'
                                        }, 100, function() {
                                            $(message_content_el2).remove();
                                            display_message('PDF 문서 저장을 완료했습니다!', 'green');
                                        });
                                    }
                                });
                            }
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

});