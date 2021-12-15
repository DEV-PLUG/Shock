// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

// 암호화 모듈

const crypto = require('crypto');
const CryptoJS =  require('crypto-js');

// jwt

const jwt = require('jsonwebtoken');

// 데이터베이스 연결

const getConnection = require('../database/database');

// IP 관련 모듈

const Ip = require('ip');

// 환경 변수

require("dotenv").config();

// 시간 관련 모듈

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// ---------- 메인 코드(로그인) ---------- //

router.post("/", async function(req, res) {

    // 받아오는 데이터
    // shop_name, shop_des, shop_profile

    // 변수 선언
    let body = req.body;

    // 받아온 비밀번호 복호화
    body.user_password = JSON.parse(CryptoJS.AES.decrypt(body.user_password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8));

    if(!body.user_email_name || !body.user_password) {
        return res.status(400).json({
            success: false,
            message: 'There is no info'
        }); // 필요한 정보가 없음
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 로그인 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    
    try {

        getConnection((connection) => {

            // 쿼리문 작성
            var sql = `SELECT * FROM user_info WHERE user_email LIKE '${body.user_email_name}' or user_name LIKE '${body.user_email_name}'`;

            connection.query(sql, function (err, result) {

                if(result.length <= 0) { // 회원가입하지 않았는지 확인
                    return res.status(400).json({
                        success: false,
                        message: 'The user does not exist'
                    });
                } else {

                    let dbPassword = result[0]['user_password'];
                    let salt = result[0]['salt'];
            
                    let inputPassword = body.user_password;
                    let hashPassword = crypto.createHash("sha512").update(crypto.createHash("sha512").update(crypto.createHash("sha512").update(inputPassword + (salt + process.env.USER_PASSWORD_SECRET)).digest("hex")).digest("hex")).digest("hex");
                
                    if(dbPassword == hashPassword) {

                        // 토큰 세팅
                        var JwtUserName = result[0]['user_name'];
                        const refreshToken = jwt.sign({ JwtUserName },
                            process.env.JWT_SECRET, {
                            expiresIn: '14d'
                        });

                        // DB에 refresh 토큰 삽입
                        connection.query(`UPDATE user_info SET token = '${refreshToken}' WHERE user_name = '${result[0]['user_name']}'`);
            
                        const accessToken = jwt.sign({ JwtUserName },
                            process.env.JWT_SECRET, {
                            expiresIn: '1h' // 1h
                        });
                        
                        // 서버 세션에 토큰 세팅
                        req.session.accessToken = accessToken;
                        req.session.refreshToken = refreshToken;
            
                        // 로그인 성공을 시스템 로그에 기록
                        connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('User Login', 'User Login Success with ${result[0]['user_name']}', '${today}', '${Ip.address()}')`, function(err, result) {
                            return res.status(200).json({
                                success: true
                            }); // 로그인이 성공됨을 최종적으로 리턴
                        });

                    } else {

                        return res.status(400).json({
                            success: false,
                            message: 'The password does not match'
                        }); // 비밀번호 틀림

                    }

                }

            });

            connection.release();
        });
        
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('User Login', 'User Login Failed(js Error) with ${req.session.userName}', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
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