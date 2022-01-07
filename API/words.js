// ---------- 모듈 ---------- //

var express = require('express');
var router = express.Router();

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

// jwt

const jwt = require('jsonwebtoken');

// ---------- 메인 코드(회원가입) ---------- //

router.put("/:id", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // words_title, words_text

    // 변수 선언
    let body = req.body;

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 단어장 수정 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    
    try {

        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]+$/;
        if(!regex.test(body.words_title)) { // 단어장 이름 검사
            return res.status(400).json({
                success: false,
                message: 'Title must include only English, Korean and number'
            });
        }

        if(body.words_text.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Words are too many'
            });
        }

        getConnection((connection) => {

            connection.query(`SELECT words_title, words_text, words_owner FROM words_info WHERE words_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(400).json({
                        success: false,
                        message: 'The words id does not exist'
                    });
                }

                if(result[0].words_owner != APIusername) {
                    const now_check_words_owner = result[0].words_owner;
                    connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {
                        for(var i = 0; i < result.length; i++) {
                            if(now_check_words_owner == result[i].class_id) break;
                        }
    
                        if(i == result.length) {
                            return res.status(400).json({
                                success: false,
                                message: 'You are not owner of this words'
                            });
                        } else {
                            edit_words_detail();
                        }
                    });
                } else {
                    edit_words_detail();
                }

                function edit_words_detail() {
                    const words_title = body.words_title;

                    // API 키 선언
                    const client_id = process.env.PAPAGO_CLIENT_ID;
                    const client_secret = process.env.PAPAGO_CLIENT_SECRET;
    
                    const before_title = body.words_title;
                    const before_text = body.words_text;
    
                    var final_return_words_mean_get = []; // 리턴 변수 선언
    
                    // API 정보 선언
                    var translate_query;
                    var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
                    var request = require('request');
                    var options;
    
                    const words_text_length = body.words_text.length;
                    for(var i = 0; i < body.words_text.length; i++) {
                        if(body.words_text[i][1] == '') {
                            translate_query = body.words_text[i][0];
    
                            options = {
                                url: api_url,
                                form: {'source':'en', 'target':'ko', 'text':translate_query},
                                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
                            };
        
                            function translatePapago(translate_query) {
                                return new Promise(function(resolve, reject) {
                                    request.post(options, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            resolve({body, translate_query, words_text_length});
                                        } else {
                                            console.log('PapagoError = ' + response.statusCode);
                                        }
                                    });
                                });
                            }
                            translatePapago(translate_query).then( function(body) {
                                final_return_words_mean_get.push([body.translate_query, JSON.parse(body.body).message.result.translatedText])
        
                                if(final_return_words_mean_get.length == words_text_length) {
        
                                    wordsMeanToken = jwt.sign({ final_return_words_mean_get },
                                        process.env.JWT_SECRET
                                    );
        
                                    connection.query(`UPDATE words_info SET words_title = '${words_title}', words_text = '${wordsMeanToken}' WHERE words_id = '${req.params.id}'`, function (err, result) {
        
                                        if(result) {
                                            // 단어장 생성 성공을 시스템 로그에 기록
                                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('UPDATE Words', 'UPDATE Words Success ${req.params.id} with ${APIusername} from title: ${before_title} text: ${before_text} to title: ${body.words_title} text: ${wordsMeanToken}', '${today}', '${Ip.address()}')`, function(err, result) {
                                                return res.status(200).json({
                                                    success: true
                                                }); // 단어장 생성이 성공됨을 최종적으로 리턴
                                            });
                                        } else {
                                            // 단어장 생성 실패시 에러 로그에 기록
                                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('UPDATE Words', 'UPDATE Words Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message: 'Unknown DB error'
                                                });
                                            });
                                        }
                    
                                    });
                                }
                            });
                        } else {
                            final_return_words_mean_get.push([body.words_text[i][0], body.words_text[i][1]])
        
                            if(final_return_words_mean_get.length == words_text_length) {
    
                                wordsMeanToken = jwt.sign({ final_return_words_mean_get },
                                    process.env.JWT_SECRET
                                );
    
                                connection.query(`UPDATE words_info SET words_title = '${words_title}', words_text = '${wordsMeanToken}' WHERE words_id = '${req.params.id}'`, function (err, result) {
    
                                    if(result) {
                                        // 단어장 생성 성공을 시스템 로그에 기록
                                        connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('UPDATE Words', 'UPDATE Words Success ${req.params.id} with ${APIusername} from title: ${before_title} text: ${before_text} to title: ${body.words_title} text: ${wordsMeanToken}', '${today}', '${Ip.address()}')`, function(err, result) {
                                            return res.status(200).json({
                                                success: true
                                            }); // 단어장 생성이 성공됨을 최종적으로 리턴
                                        });
                                    } else {
                                        // 단어장 생성 실패시 에러 로그에 기록
                                        connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('UPDATE Words', 'UPDATE Words Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                            return res.status(500).json({
                                                success: false,
                                                message: 'Unknown DB error'
                                            });
                                        });
                                    }
                
                                });
                            }
                        }
                    }
                }
    
            });
            
            connection.release();
    
        });
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Update Words', 'Update Words Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }
    
});

router.delete("/:id", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }
    // 변수 선언
    let body = req.body;

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 단어장 삭제 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    
    try {
        getConnection((connection) => {

            connection.query(`SELECT words_title, words_text, words_owner FROM words_info WHERE words_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(400).json({
                        success: false,
                        message: 'The words id does not exist'
                    });
                }
    
                
                if(result[0].words_owner != APIusername) {
                    const now_check_words_owner = result[0].words_owner;
                    connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {
                        for(var i = 0; i < result.length; i++) {
                            if(now_check_words_owner == result[i].class_id) break;
                        }
    
                        if(i == result.length) {
                            return res.status(400).json({
                                success: false,
                                message: 'You are not owner of this words'
                            });
                        } else {
                            delete_words();
                        }
                    });
                } else {
                    delete_words();
                }
    
                function delete_words() {
                    connection.query(`DELETE FROM words_info WHERE words_id = '${req.params.id}'`, function (err, result) {
    
                        if(result) {
                            // 단어장 삭제 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Delete Words', 'Delete Words Success ${req.params.id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 단어장 삭제가 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 단어장 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Words', 'Delete Words Failed(DB Error) ${req.params.id} with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
        
                    });
                }
    
            });
            
            connection.release();
    
        });
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Words', 'Delete Words Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }
    
});

router.get("/:id", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }
    
    getConnection((connection) => {

        connection.query(`SELECT words_title, words_text, words_owner FROM words_info WHERE words_id = '${req.params.id}'`, function (err, result) {

            if(result.length <= 0 || result == null) {
                return res.status(404).json({
                    success: false,
                    message: 'The words does not exist'
                });
            }

            if(result[0].words_owner != APIusername) {
                const now_check_words_owner = result[0].words_owner;
                connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {
                    for(var i = 0; i < result.length; i++) {
                        if(now_check_words_owner == result[i].class_id) break;
                    }

                    if(i == result.length) {
                        connection.query(`SELECT class FROM user_info WHERE user_name = '${APIusername}'`, function (err, result) {
                            for(var i = 0; i < result[0].class.split(',').length; i++) {
                                if(result[0].class.split(',')[i] == now_check_words_owner) break;
                            }

                            if(i == result[0].class.split(',').length) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'You are not owner of this words'
                                });
                            } else {
                                ready_return_words_detail();
                            }
                        });
                    } else {
                        ready_return_words_detail();
                    }
                });
            } else {
                ready_return_words_detail();
            }

            function ready_return_words_detail() {
                var final_return_words_get = []; // 리턴 변수 선언

                jwt.verify(result[0].words_text, process.env.JWT_SECRET,
                    function(err, decoded) {
                        if(decoded) {
                            final_return_words_get = decoded.final_return_words_mean_get;
                        }
                    }
                );

                if(/[0-9]/.test(result[0].words_owner) && result[0].words_owner.length == 18) {
                    connection.query(`SELECT class_name FROM class_info WHERE class_id = '${result[0].words_owner}'`, function (err, result2) {
                    
                        return res.status(200).json({
                            success: true,
                            content: { title: result[0].words_title, words: final_return_words_get, owner: result2[0].class_name, owner_type: 'class' }
                        });

                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        content: { title: result[0].words_title, words: final_return_words_get, owner: result[0].words_owner, owner_type: 'user' }
                    });
                }

            }

        });
        
        connection.release();

    });
    
});

router.get("/", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    getConnection((connection) => {

        connection.query(`SELECT words_title, words_text, words_id FROM words_info WHERE words_owner = '${APIusername}'`, function (err, result) {

            var final_return_words = [];

            if(result.length <= 0) {
                final_return_words = null;
            }

            for(var i = 0; i < result.length; i++) {
                jwt.verify(result[i].words_text, process.env.JWT_SECRET,
                    function(err, decoded) {
                        if(decoded) {
                            final_return_words.push({ title: result[i].words_title, words: decoded.final_return_words_mean_get, id: result[i].words_id })
                        }
                    }
                );
            }

            connection.query(`SELECT class FROM user_info WHERE user_name = '${APIusername}'`, function (err, result) {

                let user_class_final_return_words = [];
                let owner_class_final_return_words = [];

                function record_user_class_words(class_id, i) {
                    return new Promise(function(resolve, reject) {
                        connection.query(`SELECT class_name, class_id FROM class_info WHERE class_id = '${class_id}'`, function (err, result) {
                            user_class_final_return_words.push({ id: result[0].class_id, name: result[0].class_name, words: [] });

                            connection.query(`SELECT words_title, words_text, words_id FROM words_info WHERE words_owner = '${class_id}'`, function (err, result) {
                    
                                for(var j = 0; j < result.length; j++) {
                                    jwt.verify(result[j].words_text, process.env.JWT_SECRET,
                                        function(err, decoded) {
                                            if(decoded) {
                                                user_class_final_return_words[i].words.push({ title: result[j].words_title, words: decoded.final_return_words_mean_get, id: result[j].words_id })
                                            }
                                        }
                                    );
                                }
                                resolve();

                            });
                        });
                    });
                }
    
                if(result[0].class == null || result[0].class == '') {
                    user_class_final_return_words = null;

                    connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {
                        record_owner_class(result);
                    });
                } else {
                    async function record_user_class() {
                        for(var i = 0; i < result[0].class.split(',').length; i++) {
                            await record_user_class_words(result[0].class.split(',')[i], i);
                        }

                        connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {
                            record_owner_class(result);
                        });
                    }
                    
                    record_user_class();
                }

                function record_owner_class_words(class_id, i) {
                    return new Promise(function(resolve, reject) {
                        connection.query(`SELECT words_title, words_text, words_id FROM words_info WHERE words_owner = '${class_id}'`, function (err, result) {
                
                            for(var j = 0; j < result.length; j++) {
                                jwt.verify(result[j].words_text, process.env.JWT_SECRET,
                                    function(err, decoded) {
                                        if(decoded) {
                                            owner_class_final_return_words[i].words.push({ title: result[j].words_title, words: decoded.final_return_words_mean_get, id: result[j].words_id })
                                        }
                                    }
                                );
                            }
                            resolve();

                        });
                    });
                }

                async function record_owner_class(result) {

                    for(var i = 0; i < result.length; i++) {
                        owner_class_final_return_words.push({ id: result[i].class_id, name: result[i].class_name, words: [] });
                        await record_owner_class_words(result[i].class_id, i);
                    }
                    return res.status(200).json({
                        success: true,
                        content: { personal: final_return_words, user: user_class_final_return_words, owner: owner_class_final_return_words }
                    });
                }
    
            });
        });
        
        connection.release();

    });
    
});

router.post("/", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // words_title, words_text

    // 변수 선언
    let body = req.body;

    var newWordsOwner;
    if(body.words_class == 'personal') newWordsOwner = APIusername;
    else newWordsOwner = body.words_class;

    // 단어장 추가 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    try {

        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]+$/;
        if(!regex.test(body.words_title)) { // 단어장 이름 검사
            return res.status(400).json({
                success: false,
                message: 'Title must include only English, Korean and number'
            });
        }
        if(body.words_title.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'Title is too long'
            });
        }
        if(body.words_text.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Words are too many'
            });
        }

        getConnection((connection) => {

            connection.query(`SELECT words_title, words_text FROM words_info WHERE words_owner = '${APIusername}'`, function (err, result) {

                if(result.length >= 20) {
                    return res.status(400).json({
                        success: false,
                        message: 'The user cannot make words more then 20'
                    });
                }

                // 18자리의 숫자로 이루어진 랜덤한 단어장 아이디를 생성함
                function create_new_words_id() {
                    new_words_id = Math.floor(Math.random() * (999999999999999999 - 100000000000000000 + 1)) + 100000000000000000;
                    connection.query(`SELECT words_owner FROM words_info WHERE words_id = '${new_words_id}'`, function (err, result) {
                        if(result == null || !result[0]) return;
                        else create_new_words_id();
                    });
                }
                create_new_words_id();

                const words_title = body.words_title;

                // API 키 선언
                const client_id = process.env.PAPAGO_CLIENT_ID;
                const client_secret = process.env.PAPAGO_CLIENT_SECRET;

                var final_return_words_mean_get = []; // 리턴 변수 선언

                // API 정보 선언
                var translate_query;
                var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
                var request = require('request');
                var options;

                const words_text_length = body.words_text.length;

                function translatePapago(translate_query) {
                    return new Promise(function(resolve, reject) {
                        request.post(options, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                resolve({body, translate_query, words_text_length});
                            } else {
                                console.log('PapagoError = ' + response.statusCode);
                            }
                        });
                    });
                }

                for(var i = 0; i < body.words_text.length; i++) {

                    if(body.words_text[i][0] == '') continue;
                    
                    if(body.words_text[i][1] == '') {
                        translate_query = body.words_text[i][0];

                        options = {
                            url: api_url,
                            form: {'source':'en', 'target':'ko', 'text':translate_query},
                            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
                        };

                        translatePapago(translate_query).then( function(body) {
                            final_return_words_mean_get.push([body.translate_query, JSON.parse(body.body).message.result.translatedText])
    
                            if(final_return_words_mean_get.length == words_text_length) {
    
                                wordsMeanToken = jwt.sign({ final_return_words_mean_get },
                                    process.env.JWT_SECRET
                                );

                                connection.query(`INSERT INTO words_info(words_id, words_owner, words_title, words_text, createdAt, updatedAt) VALUES('${new_words_id}', '${newWordsOwner}', '${words_title}', '${wordsMeanToken}', '${today}', '${today}')`, function (err, result) {
    
                                    if(result) {
                                        // 단어장 생성 성공을 시스템 로그에 기록
                                        connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Add Words', 'Add Words Success ${new_words_id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                            return res.status(200).json({
                                                success: true
                                            }); // 단어장 생성이 성공됨을 최종적으로 리턴
                                        });
                                    } else {
                                        // 단어장 생성 실패시 에러 로그에 기록
                                        connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Words', 'Add Words Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                            return res.status(500).json({
                                                success: false,
                                                message: 'Unknown DB error'
                                            });
                                        });
                                    }
                
                                });
                            }
                        });
                    } else {
                        final_return_words_mean_get.push([body.words_text[i][0], body.words_text[i][1]]);

                        if(final_return_words_mean_get.length == words_text_length) {
    
                            wordsMeanToken = jwt.sign({ final_return_words_mean_get },
                                process.env.JWT_SECRET
                            );

                            connection.query(`INSERT INTO words_info(words_id, words_owner, words_title, words_text, createdAt, updatedAt) VALUES('${new_words_id}', '${newWordsOwner}', '${words_title}', '${wordsMeanToken}', '${today}', '${today}')`, function (err, result) {

                                if(result) {
                                    // 단어장 생성 성공을 시스템 로그에 기록
                                    connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Add Words', 'Add Words Success ${new_words_id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                        return res.status(200).json({
                                            success: true
                                        }); // 단어장 생성이 성공됨을 최종적으로 리턴
                                    });
                                } else {
                                    // 단어장 생성 실패시 에러 로그에 기록
                                    connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Words', 'Add Words Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                        return res.status(500).json({
                                            success: false,
                                            message: 'Unknown DB error'
                                        });
                                    });
                                }
            
                            });
                        }
                    }
                }

            });

            connection.release();
        });
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Words', 'Add Words Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }
    
});

router.post("/:id", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // words_title, words_text

    // 변수 선언
    let body = req.body;

    // 단어장 복사 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT words_title, words_text FROM words_info WHERE words_owner = '${APIusername}'`, function (err, result) {

                if(result.length >= 20) {
                    return res.status(400).json({
                        success: false,
                        message: 'The user cannot make words more then 20'
                    });
                }

                // 18자리의 숫자로 이루어진 랜덤한 단어장 아이디를 생성함
                function create_new_words_id() {
                    new_words_id = Math.floor(Math.random() * (999999999999999999 - 100000000000000000 + 1)) + 100000000000000000;
                    connection.query(`SELECT * FROM words_info WHERE words_id = '${new_words_id}'`, function (err, result) {
                        if(result == null || !result[0]) return;
                        else create_new_words_id();
                    });
                }
                create_new_words_id();

                connection.query(`SELECT words_title, words_text FROM words_info WHERE words_id = '${req.params.id}'`, function (err, result) {

                    if(result == null || result.length <= 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'The words does not exist'
                        });
                    }

                    connection.query(`INSERT INTO words_info(words_id, words_owner, words_title, words_text, createdAt, updatedAt) VALUES('${new_words_id}', '${APIusername}', '${result[0].words_title}', '${result[0].words_text}', '${today}', '${today}')`, function (err, result) {

                        if(result) {
                            // 단어장 생성 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Copy Words', 'Copy Words Success ${new_words_id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 단어장 생성이 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 단어장 생성 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Copy Words', 'Copy Words Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Copy Words', 'Copy Words Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
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