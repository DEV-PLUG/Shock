// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// ---------- 메인 코드(로그인) 페이지 연결) ---------- //

router.get('/', function(req, res) {

    res.render("mobile.html");

});

module.exports = router;