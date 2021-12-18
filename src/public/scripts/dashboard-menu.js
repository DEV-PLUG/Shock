$(document).ready(function () {
    $('.menu-Sellation-profile').click(function () {
		location.href = '/dashboard';
	});
    $('.menu-Sellation-login-btn').click(function () {
		location.href = '/logout';
	});

	window.addEventListener('scroll', () => {
		if(document.documentElement.scrollTop != 0) {
			document.querySelector('.home-menu').style.backdropFilter = 'blur(30px)';
		} else {
			document.querySelector('.home-menu').style.backdropFilter = 'blur(0px)';
		}
	});
});