// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// 암호화 모듈

const crypto = require('crypto');
const CryptoJS =  require('crypto-js');

// 데이터베이스 연결

const getConnection = require('../database/database');

// 환경 변수

require("dotenv").config();

// IP 관련 모듈

const Ip = require('ip');

// 유저 체크 모듈

const check_user = require('../modules/check_user');

// 시간 관련 모듈

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// ---------- 메인 코드(회원가입) ---------- //

router.post("/", function(req, res) {

    // 받아오는 데이터
    // user_name, user_email, user_password, user_re_password

    // 변수 선언
    let body = req.body;

    // 비밀번호 복호화
    body.user_password = JSON.parse(CryptoJS.AES.decrypt(body.user_password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8));
    body.user_re_password = JSON.parse(CryptoJS.AES.decrypt(body.user_re_password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8));

    // 회원가입 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    try {

        if(body.user_name.indexOf(" ") != -1) { // 아이디 공백 검사
            return res.status(400).json({
                success: false,
                message: 'There is a blank in the id'
            });
        }
        if(body.user_email.indexOf(" ") != -1) { // 이메일 공백 검사
            return res.status(400).json({
                success: false,
                message: 'There is a blank in the email'
            });
        }
        if(body.user_name.length > 20) { // 아이디 길이 검사
            return res.status(400).json({
                success: false,
                message: 'The id is too long'
            });
        }
        if(/[0-9]/.test(body.user_name) && body.user_name.length == 18) {
            return res.status(400).json({
                success: false,
                message: 'The id cannot only number and 18 length'
            });
        }
        if(body.user_email.length > 320) { // 이메일 길이 검사
            return res.status(400).json({
                success: false,
                message: 'The email is too long'
            });
        }
        if(body.user_password.length > 50) { // 비밀번호 길이 검사
            return res.status(400).json({
                success: false,
                message: 'The password is too long'
            });
        }
        if(body.user_password.length < 5) { // 비밀번호 길이 검사
            return res.status(400).json({
                success: false,
                message: 'The password is too short'
            });
        }
        if(body.user_password != body.user_re_password) { // 비밀번호 일치 여부 검사
            return res.status(400).json({
                success: false,
                message: 'The password is not same'
            });
        }
        if(!body.user_name || !body.user_email || !body.user_password || !body.user_re_password) { // 필요한 정보가 없음
            return res.status(400).json({
                success: false,
                message: 'There is no info'
            });
        }

        var pattern1 = /[0-9]/;
        var pattern2 = /[a-zA-Z]/;
        var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;
        if(!pattern1.test(body.user_password) || !pattern2.test(body.user_password) || !pattern3.test(body.user_password)) {
            return res.status(400).json({
                success: false,
                message: 'The password does not fit the pattern'
            }); // 비밀번호 패턴 검사
        }
        
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if(body.user_email.match(regExp) == null) {
            return res.status(400).json({
                success: false,
                message: 'The email does not fit the pattern'
            }); // 이메일 패턴 검사
        }

        getConnection((connection) => {

            connection.query(`SELECT * FROM user_info WHERE user_name LIKE '${body.user_name}'`, function (err, result) {

                if(result.length >= 1)  {
                    return res.status(400).json({
                        success: false,
                        message: 'The id already exist'
                    }); // 아이디 중복
                }

                connection.query(`SELECT * FROM user_info WHERE user_email LIKE '${body.user_email}'`, function (err, result2) {

                    if(result2.length >= 1) {
                        return res.status(400).json({
                            success: false,
                            message: 'The password does not fit the pattern'
                        }); // 이메일 중복
                    }

                    // 비밀번호 암호화
                    let inputPassword = body.user_password;
                    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
                    let hashPassword = crypto.createHash("sha512").update(crypto.createHash("sha512").update(crypto.createHash("sha512").update(inputPassword + (salt + process.env.USER_PASSWORD_SECRET)).digest("hex")).digest("hex")).digest("hex");

                    // 쿼리문 작성
                    var sign_up_post = `INSERT INTO user_info(user_name, user_email, user_password, createdAt, updatedAt, salt) VALUES('${body.user_name}', '${body.user_email}', '${hashPassword}', '${today}', '${today}', '${salt}')`;

                    connection.query(sign_up_post, function(err, result) {
                        if(result) {
                            // 회원가입 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('User Signup', 'Signup Success with ${body.user_name}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 회원가입이 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 회원가입 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('User Signup', 'Signup Failed(DB Error) with ${body.user_name}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
                    });
                });
            });

            connection.release();
        });
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('User Signup', 'Signup Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
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