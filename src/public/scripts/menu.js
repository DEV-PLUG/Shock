$(document).ready(function () {
    $('.menu-Sellation-profile').click(function () {
		location.href = '/';
	});
    $('.menu-Sellation-login-btn').click(function () {
		location.href = '/login';
	});
	$('.menu-Sellation-signup-btn').click(function () {
		location.href = '/signup';
	});

	window.addEventListener('scroll', () => {
		if(document.documentElement.scrollTop != 0) {
			document.querySelector('.home-menu').style.backgroundColor = '#ffffff90';
			document.querySelector('.home-menu').style.backdropFilter = '30px';
		} else {
			document.querySelector('.home-menu').style.backgroundColor = '#ffffff00';
			document.querySelector('.home-menu').style.backdropFilter = '0px';
		}
	});
});