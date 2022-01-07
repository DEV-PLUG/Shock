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
			document.querySelector('.home-menu').style.backdropFilter = 'blur(30px)';
			document.querySelector('.home-menu').style.webkitBackdropFilter = 'blur(30px)';
		} else {
			document.querySelector('.home-menu').style.backdropFilter = 'blur(0px)';
			document.querySelector('.home-menu').style.webkitBackdropFilter = 'blur(0px)';
		}
	});
});