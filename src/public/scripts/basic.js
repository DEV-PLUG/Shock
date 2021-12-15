function select(id) {

    document.querySelector(`#${id}-select`).classList.toggle('select-focus');
    document.querySelector(`#${id}-select-arrow`).classList.toggle('select-arrow-focus');
    document.querySelector(`#${id}-option-box`).classList.toggle('option-box-focus');

}
function close_select(id) {

    document.querySelector(`#${id}-select`).classList.remove('select-focus');
    document.querySelector(`#${id}-select-arrow`).classList.remove('select-arrow-focus');
    document.querySelector(`#${id}-option-box`).classList.remove('option-box-focus');

}
function option(id, option) {

    close_select(id);
    document.querySelector(`#${id}-selected-option`).innerText = option;

}
function checkbox(id) {

    document.querySelector(`#${id}-checkbox`).classList.toggle('checkbox-focus');

}
function radio(class_id, id) {

    for (var radio_repeat = 0; radio_repeat < document.querySelectorAll(`.${class_id}`).length; radio_repeat++) {
        document.querySelectorAll(`.${class_id}`)[radio_repeat].classList.remove('radio-focus');
    }
    document.querySelector(`#${id}`).classList.add('radio-focus');

}
function line_menu(class_id, id) {

    for (var line_menu_repeat = 0; line_menu_repeat < document.querySelectorAll(`.${class_id}`).length; line_menu_repeat++) {
        document.querySelectorAll(`.${class_id}`)[line_menu_repeat].classList.remove('line-menu-option-focus');
    }
    document.querySelector(`#${id}`).classList.add('line-menu-option-focus');

}
function modal(id) {

    document.querySelector('.modal-background').style.display = 'block'
    document.querySelector(`#${id}-modal`).style.display = 'block'
    $('.modal-background').animate( {
        display: 'block'
    }, 10, 'swing', function () {
        document.querySelector('.modal-background').classList.add('modal-background-focus');
    });

}
function close_modal(id) {

    document.querySelector('.modal-background').classList.remove('modal-background-focus');
    $('.modal-background').animate({
        display: 'none'
    }, 200, 'swing', function () {
        document.querySelector('.modal-background').style.display = 'none'
        document.querySelector(`#${id}-modal`).style.display = 'none'
    });

}
function display_message(message, color) {
    $(".message-box").append(`<div class="message-content"><div class="message-content-line-${color}"></div><div class="message-content-text">${message}</div></div>`);
    $(document.querySelectorAll('.message-content')[document.querySelectorAll('.message-content').length-1]).animate({
        left: '0px',
        opacity: '1'
    }, 100);
    const message_content_el = document.querySelectorAll('.message-content')[document.querySelectorAll('.message-content').length-1];
    setInterval(function(){
        $(message_content_el).animate({
            opacity: '0'
        }, 100, function() {
            message_content_el.style.display = 'none';
        });
    }, 5000);
}