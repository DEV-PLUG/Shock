// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// 유저 체크 모듈

const check_user = require('../modules/check_user');

router.get('/:id', function(req, res) {

    var APIusername = check_user(req.session);

    if(APIusername != 401) res.render("words-table.html"); // 로그인 여부 확인
    else res.redirect("/login");

});

module.exports = router;