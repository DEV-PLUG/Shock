$(document).ready(function () {

    // 모바일 기기 인식
    if(!navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
        location.href = '/login'
    }

    $('.hurry-up-btn').click(function () {
        modal('mobile');
    });
    $('#mobile_close_id').click(function () {
        close_modal('mobile');
    });
    $('#copy-share-link').click(function () {
        navigator.clipboard.writeText(`https://shock-english.ml`)
            .then(() => {
            display_message('클립보드에 공유 링크를 복사했어요!', 'green');
        })
            .catch(err => {
            display_message('클립보드 복사를 지원하지 않는 브라우저인 것 같아요! 대신 새창으로 링크를 열어드렸어요!', 'yellow');
            var win = window.open(`https://shock-english.ml`, '_blank');
            win.focus();
        });
    });

});