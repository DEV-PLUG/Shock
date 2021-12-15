$(document).ready(function () {
    const words_id = location.href.split('/')[4].split('?')[0];
    var words_type = 'general';
    if(location.href.split('/')[4].split('?')[1] != undefined) words_type = location.href.split('/')[4].split('?')[1].split('=')[1];

    $.ajax({
        url: `/api/words/${words_id}`,
        method: "GET",
        success: function(result) {
            if (result) {
                if(result.success == true) {

                    $('table').append(`<div class="slice"><h1 class="th">-</h1></div>`);
                    document.querySelector('h1').innerText = result.content.title;
                    for(var k = 0; k < 18; k++) {
                        if(result.content.words[k] == undefined) break;
                        if(words_type == 'ko') $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td>${result.content.words[k][1]}</td></tr>`);
                        else if(words_type == 'en') $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td>${result.content.words[k][0]}</td></tr>`);
                        else $(document.querySelectorAll('.slice')[0]).append(`<tr class="th"><td style="width: 50%;">${result.content.words[k][0]}</td><td>${result.content.words[k][1]}</td></tr>`);
                    }

                    for(var j = 1; j < parseInt(result.content.words.length / 20) + 1; j++) {
                        $('table').append(`<div class="slice"></div>`);
                        for(var k = 18 + 20 * (j - 1); k < 18 + 20 * (j - 1) + 20; k++) {
                            if(result.content.words[k] == undefined) break;
                            if(words_type == 'ko') $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td>${result.content.words[k][1]}</td></tr>`);
                            else if(words_type == 'en') $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td>${result.content.words[k][0]}</td></tr>`);
                            else $(document.querySelectorAll('.slice')[j]).append(`<tr class="th"><td style="width: 50%;">${result.content.words[k][0]}</td><td>${result.content.words[k][1]}</td></tr>`);
                        }
                    }

                    var doc = new jsPDF('p', 'mm', 'a4'); //jspdf객체 생성
                    var imgData;
                    var print_index = 1;
                    html2canvas($(document.querySelectorAll('.slice')[0])[0]).then(function(canvas) {
                        imgData = canvas.toDataURL('image/png'); //캔버스를 이미지로 변환
                        doc.addImage(imgData, 'PNG', 0, 0); //이미지를 기반으로 pdf생성

                        if(document.querySelectorAll('.slice').length == 1) {
                            doc.save(`${result.content.title} - Shock 단어장.pdf`); //pdf저장
                            return location.href = '/dashboard/learn';
                        }

                        for(var q = 1; q < document.querySelectorAll('.slice').length; q++) {
                            html2canvas($(document.querySelectorAll('.slice')[q])[0]).then(function(canvas) {
                                doc.addPage();
                                print_index++;
                                imgData = canvas.toDataURL('image/png'); //캔버스를 이미지로 변환
                                doc.addImage(imgData, 'PNG', 0, 0); //이미지를 기반으로 pdf생성

                                if(print_index == document.querySelectorAll('.slice').length) {
                                    doc.save(`${result.content.title} - Shock 단어장.pdf`); //pdf저장
                                    return location.href = '/dashboard/learn';
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