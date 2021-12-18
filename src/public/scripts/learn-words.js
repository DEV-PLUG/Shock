$(".home-menu-box").load("/views/partials/dashboard-menu.html");

$(document).ready(function () {
    const words_id = location.href.split('/')[5].split('?')[0]
    const words_type = location.href.split('/')[5].split('?')[1].split('=')[1]
    console.log(words_type)

    var word_content;
    function load_words() {
        $.ajax({
            url: `/api/words/${words_id}`,
            method: "GET",
            success: function(result) {
                if (result) {
                    if(result.success == true) {
                        word_content = result.content;

                        document.querySelector('#before').classList.add('btn-gray-disabled');
                        document.querySelector('#before').classList.remove('btn-gray');

                        if(words_type == 'words') {
                            document.querySelector('.words-word').innerText = word_content.words[0][0];
                            document.querySelector('.words-mean').innerText = word_content.words[0][1];
                        } else if(words_type == 'words-ko') {
                            document.querySelector('.words-word').innerText = word_content.words[0][1];
                            document.querySelector('.words-mean').style.display = 'none';
                        } else if(words_type == 'words-en') {
                            document.querySelector('.words-word').innerText = word_content.words[0][0];
                            document.querySelector('.words-mean').style.display = 'none';
                        }
                        document.querySelector('.words-count').innerText = `${word_content.words.length}개의 단어중 / 1번째 단어`;
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

    var index = 0;

    $('.btn-blue').click(function () {
        if(word_content.words.length - 1 > index) {
            index++;
            if(words_type == 'words') {
                document.querySelector('.words-word').innerText = word_content.words[index][0];
                document.querySelector('.words-mean').innerText = word_content.words[index][1];
            } else if(words_type == 'words-ko') {
                document.querySelector('.words-word').innerText = word_content.words[index][1];
            } else if(words_type == 'words-en') {
                document.querySelector('.words-word').innerText = word_content.words[index][0];
            }
            document.querySelector('.words-count').innerText = `${word_content.words.length}개의 단어중 / ${index + 1}번째 단어`;

            if(index != 0) {
                document.querySelector('#before').classList.remove('btn-gray-disabled');
                document.querySelector('#before').classList.add('btn-gray');
            } 
            if(word_content.words.length - 1 == index) {
                document.querySelector('#next').classList.add('btn-blue-disabled');
                document.querySelector('#next').classList.remove('btn-blue');
            }
        }
    });
    $('.btn-gray').click(function () {
        if(0 < index) {
            index--;
            if(words_type == 'words') {
                document.querySelector('.words-word').innerText = word_content.words[index][0];
                document.querySelector('.words-mean').innerText = word_content.words[index][1];
            } else if(words_type == 'words-ko') {
                document.querySelector('.words-word').innerText = word_content.words[index][1];
            } else if(words_type == 'words-en') {
                document.querySelector('.words-word').innerText = word_content.words[index][0];
            }
            document.querySelector('.words-count').innerText = `${word_content.words.length}개의 단어중 / ${index + 1}번째 단어`;

            if(index == 0) {
                document.querySelector('#before').classList.add('btn-gray-disabled');
                document.querySelector('#before').classList.remove('btn-gray');
            }
            if(word_content.words.length - 1 > index) {
                document.querySelector('#next').classList.remove('btn-blue-disabled');
                document.querySelector('#next').classList.add('btn-blue');
            }
        }
    });
});