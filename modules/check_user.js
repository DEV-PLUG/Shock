// 환경 변수

require("dotenv").config();

// jwt

const jwt = require('jsonwebtoken');

// 데이터베이스 연결

const getConnection = require('../database/database');

let returnValue; // 리턴할 텍스트 및 코드 변수 지정

function check_user(session) {
    
    var CheckUserName; // 유저 이름 전역 변수 지정
    const CheckUserSession = session; // 세션 전역 변수 지정

    jwt.verify(CheckUserSession.accessToken, process.env.JWT_SECRET,
        function(err, decoded){
            if(err) {
                jwt.verify(CheckUserSession.refreshToken, process.env.JWT_SECRET,
                    function(err, decoded){
                        if(err) { // case1: access token과 refresh token 모두가 만료된 경우
                            returnValue = 401; // 로그인 페이지로 리다이렉트
                        } else { // case2: access token은 만료됐지만, refresh token은 유효한 경우
                            CheckUserName = decoded.JwtUserName;

                            returnValue = CheckUserName;

                            getConnection((connection) => {

                                connection.query(`SELECT token FROM user_info WHERE user_name = '${CheckUserName}'`, function (err, result) {
                                    if(result != null && result != [] && result[0]['token'] == CheckUserSession.refreshToken) {
                                        const accessToken = jwt.sign({ CheckUserName },
                                            process.env.JWT_SECRET, {
                                            expiresIn: '1h'
                                        });
                                        
                                        CheckUserSession.accessToken = accessToken;

                                        returnValue = CheckUserName;
                                    } else {
                                        returnValue = 401; // 로그인 페이지로 리다이렉트
                                    }
                                });
                    
                                connection.release();
                            });
                        }
                    }
                );
            } else {
                CheckUserName = decoded.JwtUserName;

                returnValue = CheckUserName;

                const regreshToken_const = CheckUserSession.refreshToken;
                jwt.verify(CheckUserSession.refreshToken, process.env.JWT_SECRET, 
                    function(err, decoded){
                        if(err) { // case3: access token은 유효하지만, refresh token은 만료된 경우
                            const refreshToken = jwt.sign({ CheckUserName },
                                process.env.JWT_SECRET, {
                                expiresIn: '14d'
                            });

                            // DB에 refresh 토큰 삽입
                            connection.query(`UPDATE user_info SET token = '${refreshToken}' WHERE user_name = '${result[0]['user_name']}'`);

                            CheckUserSession.refreshToken = refreshToken;

                            returnValue = CheckUserName;
                        } else {
                            getConnection((connection) => {

                                connection.query(`SELECT token FROM user_info WHERE user_name = '${CheckUserName}'`, function (err, result) {
                                    if(result != null && result != [] && result[0]['token'] == regreshToken_const) { // case4: 둘 다 유효한 경우
                                        returnValue = CheckUserName;
                                    } else { // case3: access token은 유효하지만, refresh token은 만료된 경우
                                        const refreshToken = jwt.sign({ CheckUserName },
                                            process.env.JWT_SECRET, {
                                            expiresIn: '14d'
                                        });
                
                                        // DB에 refresh 토큰 삽입
                                        connection.query(`UPDATE user_info SET token = '${refreshToken}' WHERE user_name = '${result[0]['user_name']}'`);
        
                                        CheckUserSession.refreshToken = refreshToken;
        
                                        returnValue = CheckUserName;
                                    }
                                });
                    
                                connection.release();
                            });
                        }
                    }
                );
            }
        }
    );

    return returnValue;
}

module.exports = check_user;