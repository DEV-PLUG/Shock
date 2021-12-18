$(document).ready(function () {
    document.querySelector('.box').style.display = 'none';
    document.querySelector('#add-words .btn-loading-box').style.display = 'none';
    document.querySelector('.contains').style.display = 'none';
    const words_id = location.href.split('/')[6].split('?')[0]

    $.ajax({
        url: `/api/words/${words_id}`,
        method: "GET",
        success: function(result) {
            if (result) {
                if(result.success == true) {
                    word_content = result.content;

                    document.querySelector('.title').innerText = word_content.title;
                    document.querySelector('.des').innerText = `${word_content.words.length}개의 단어\n작성자: ${word_content.owner}`;
                    if(result.content.words.length < 10) {
                        document.querySelector('.contains').style.display = 'none';
                        for(var j = 0; j < result.content.words.length; j++) {
                            $('.words-box').append(`<div class="words-box-box"><div class="words-title">${word_content.words[j][0]}</div><div class="words-mean">${word_content.words[j][1]}</div></div>`);
                        }
                    } else {
                        document.querySelector('.contains').innerText = `외 ${result.content.words.length - 10}개의 단어가 포함됨.`
                        document.querySelector('.contains').style.display = 'block';
                        for(var j = 0; j < 10; j++) {
                            $('.words-box').append(`<div class="words-box-box"><div class="words-title">${word_content.words[j][0]}</div><div class="words-mean">${word_content.words[j][1]}</div></div>`);
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

    $('#add-words').click(function () {
        if(document.querySelector('#add-words').classList.contains('btn-blue-disabled')) return;

        document.querySelector('#add-words .btn-loading-box').style.display = 'block';
        document.querySelector('#add-words').classList.add('btn-blue-disabled');
        document.querySelector('#add-words').classList.remove('btn-blue');

        $.ajax({
            url: `/api/words/${words_id}`,
            method: "POST",
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        document.querySelector('#add-words .btn-loading-box').style.display = 'none';
                        document.querySelector('#add-words').classList.remove('btn-blue-disabled');
                        document.querySelector('#add-words').classList.add('btn-blue');

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
