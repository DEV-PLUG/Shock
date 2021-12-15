// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// IP 관련 모듈

const Ip = require('ip');

// 데이터베이스 연결

const getConnection = require('../database/database');

// 환경 변수

require("dotenv").config();

// 유저 체크 모듈

const check_user = require('../modules/check_user');

// 시간 관련 모듈

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// ---------- 메인 코드(로그아웃) ---------- //

router.get("/", function(req, res){

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 로그아웃 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        req.session.destroy(); // 세션 삭제
        res.clearCookie(); // 쿠키 삭제

        getConnection((connection) => {

            // 로그아웃을 시스템 로그에 기록
            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('User Logout', 'Logout Success with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.redirect("/login"); // 로그인 페이지로 리다이렉트
            });

            connection.release();
        });

    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('User Logout', 'Logout Failed(js Error) by ${APIusername}', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });

    }
});

module.exports = router;