$(document).ready(function () {

	$('.mobile-menu-background').append(`<div class="flex-between">
		<div class="menu-Sellation-profile"></div>
		<div class="mobile-menu-close"><span class="material-icons">close</span></div>
	</div>
	<div class="mobile-menu-content">
		<a href="/dashboard/words" class="menu-menu-text">단어장</a>
		<a href="/dashboard/learn" class="menu-menu-text">학습</a>
		<a href="/dashboard/class" class="menu-menu-text">클래스</a>
		<div class="menu-Sellation-login-btn flex"><span class="material-icons btn-icon" style="line-height: 40px;">logout</span>로그아웃</div>
	</div>`);

	$('.menu-Sellation-profile').click(function () {
		location.href = '/dashboard';
	});
    $('.menu-Sellation-login-btn').click(function () {
		location.href = '/logout';
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

	$('.mobile-menu-open').click(function () {
		document.querySelector('.mobile-menu-background').style.display = 'block';
		document.querySelector('.mobile-menu-content').style.display = 'block';
		document.querySelector('.mobile-menu-close').style.display = 'block';
		$(document.querySelector('.mobile-menu-background')).animate({
			height: '100vh'
		}, 100);
	});
	$('.mobile-menu-close').click(function () {
		$(document.querySelector('.mobile-menu-background')).animate({
			height: '0'
		}, 200, function () {
			document.querySelector('.mobile-menu-content').style.display = 'none';
			document.querySelector('.mobile-menu-close').style.display = 'none';
			$(document.querySelector('.mobile-menu-background')).animate({
				display: 'none'
			}, 200, function () {
				document.querySelector('.mobile-menu-background').style.display = 'none';
			});
		});
	});
});