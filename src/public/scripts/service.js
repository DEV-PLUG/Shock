location.href = '/login';

$(document).ready(function () {

    $('.hurry-up-btn').click(function () {
        modal('service');
    });
    $('#service_close_id').click(function () {
        close_modal('service');
    });
    $('#support-server').click(function () {
        var win = window.open(`https://discord.gg/M4ZMyg3zj2`, '_blank');
        win.focus();
    });

});