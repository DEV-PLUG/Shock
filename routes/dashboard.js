// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// 유저 체크 모듈

const check_user = require('../modules/check_user');

// ---------- 메인 코드(로그인) 페이지 연결) ---------- //

router.get('/', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("dashboard.ejs", { userName: APIusername }); // 로그인 여부 확인
    else res.redirect("/login");

});

router.get('/words', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("words.html"); // 로그인 여부 확인
    else res.redirect("/login");

});

router.get('/team', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("team.html"); // 로그인 여부 확인
    else res.redirect("/login");

});

router.get('/words/share/:id', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("share.html"); // 로그인 여부 확인
    else res.redirect("/login");

});

router.get('/learn', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("learn.html"); // 로그인 여부 확인
    else res.redirect("/login");

});
router.get('/learn/:id', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) { // 로그인 여부 확인
        if(req.query.type == 'words') res.render("learn-words.html");
        else res.redirect("/dashboard/learn");
    }
    else res.redirect("/login");

});

module.exports = router;