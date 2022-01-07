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

// jwt

const jwt = require('jsonwebtoken');

// 시간 관련 모듈

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// ---------- 메인 코드(회원가입) ---------- //

router.post("/", function(req, res) {

    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // class_title, class_des

    // 변수 선언
    let body = req.body;

    // 클래스 추가 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    try {

        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]+$/;
        if(!regex.test(body.class_title)) { // 클래스 이름 검사
            return res.status(400).json({
                success: false,
                message: 'Title must include only English, Korean and number'
            });
        }
        if(body.class_title.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'Title is too long'
            });
        }
        if(!regex.test(body.class_des)) { // 클래스 설명 검사
            return res.status(400).json({
                success: false,
                message: 'Description must include only English, Korean and number'
            });
        }
        if(body.class_des.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Description is too long'
            });
        }

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_des FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {

                if(result.length >= 3) {
                    return res.status(400).json({
                        success: false,
                        message: 'The user cannot make class more then 3'
                    });
                }

                var new_class_id, new_class_invite_code;

                // 랜덤한 클래스 초대코드를 생성함
                function create_new_class_invite_code() {
                    new_class_invite_code = Math.random().toString(36).substr(2,11);
                    connection.query(`SELECT class_name FROM class_info WHERE class_invite_code = '${new_class_invite_code}'`, function (err, result) {
                        if(result == null || !result[0]) return;
                        else create_new_class_invite_code();
                    });
                }
                create_new_class_invite_code();
                
                // 18자리의 숫자로 이루어진 랜덤한 클래스 아이디를 생성함
                function create_new_class_id() {
                    new_class_id = Math.floor(Math.random() * (999999999999999999 - 100000000000000000 + 1)) + 100000000000000000;
                    connection.query(`SELECT * FROM class_info WHERE class_id = '${new_class_id}'`, function (err, result) {
                        if(result == null || !result[0]) return;
                        else create_new_class_id();
                    });
                }
                create_new_class_id();

                connection.query(`INSERT INTO class_info(class_id, class_owner, class_name, class_des, class_invite_code, createdAt, updatedAt) VALUES('${new_class_id}', '${APIusername}', '${body.class_title}', '${body.class_des}', '${new_class_invite_code}', '${today}', '${today}')`, function (err, result) {

                    if(result) {
                        // 클래스 생성 성공을 시스템 로그에 기록
                        connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Add Class', 'Add Class Success ${new_class_id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                            return res.status(200).json({
                                success: true
                            }); // 클래스 생성이 성공됨을 최종적으로 리턴
                        });
                    } else {
                        // 클래스 생성 실패시 에러 로그에 기록
                        connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Class', 'Add Class Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                            return res.status(500).json({
                                success: false,
                                message: 'Unknown DB error'
                            });
                        });
                    }

                });

            });

            connection.release();
        });
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Class', 'Add Class Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }
    
});

router.get("/", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    getConnection((connection) => {

        connection.query(`SELECT class FROM user_info WHERE user_name = '${APIusername}'`, function (err, result) {

            let user_class = [];

            if(result == null || result[0].class == null || result[0].class == '') {
                user_class = null;
            } else {
                for(var i = 0; i < result[0].class.split(',').length; i++) {
                    user_class.push({ id: result[0].class.split(',')[i], name: null });
                }
            }

            connection.query(`SELECT class_name, class_id FROM class_info WHERE class_owner = '${APIusername}'`, function (err, result) {

                let owner_class = [];
    
                if(result == null || result == []) {
                    owner_class = null;
                } else {
                    for(var i = 0; i < result.length; i++) {
                        owner_class.push({ id: result[i].class_id, name: result[i].class_name });
                    }
                }

                if(user_class != null) {
                    for(var i = 0; i < user_class.length; i++) {
                        function check_class_name(i) {
                            connection.query(`SELECT class_name, class_id FROM class_info WHERE class_id = '${user_class[i].id}'`, function (err, result) {
                
                                if(result != null && result != [] && result[0] != undefined) {
                                    user_class[i].name = result[0].class_name;
                                }
    
                                if(i == user_class.length - 1) {
                                    return res.status(200).json({
                                        success: true,
                                        content: { user_class: user_class, owner_class: owner_class }
                                    });
                                }
                    
                            });
                        }
                        check_class_name(i);
                    }
                } else {
                    return res.status(200).json({
                        success: true,
                        content: { user_class: user_class, owner_class: owner_class }
                    });
                }
    
            });

        });
        
        connection.release();

    });

});

router.get("/:id", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    getConnection((connection) => {

        connection.query(`SELECT class_name, class_students, class_des, class_invite_code, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {

            if(result.length <= 0 || result == null) {
                return res.status(404).json({
                    success: false,
                    message: 'The class does not exist'
                });
            }

            var class_position;

            if(result[0].class_owner != APIusername) {
                if(result[0].class_students == null || result[0].class_students == '') {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer or student of the class'
                    });
                } else {
                    if(result[0].class_students.split(',').indexOf(APIusername) == -1) {
                        return res.status(400).json({
                            success: false,
                            message: 'You are not onwer or student of the class'
                        });
                    } else {
                        class_position = 'student';
                    }
                }
            } else {
                class_position = 'owner';
            }

            let class_name = result[0].class_name;
            let class_des = result[0].class_des
            let class_students;
            let class_invite_code = result[0].class_invite_code;
            
            if(result[0].class_students == null || result[0].class_students == '') {
                class_students = [];
            } else {
                class_students = result[0].class_students.split(',');
            }

            var class_words = [], class_study_log = [];

            connection.query(`SELECT words_title, words_text, words_id FROM words_info WHERE words_owner = '${req.params.id}'`, function (err, result) {

                for(var i = 0; i < result.length; i++) {
                    jwt.verify(result[i].words_text, process.env.JWT_SECRET,
                        function(err, decoded) {
                            if(decoded) {
                                class_words.push({ id: result[i].words_id, name: result[i].words_title, length: decoded.final_return_words_mean_get.length })
                            }
                        }
                    );
                }

                connection.query(`SELECT log_id, log_user, createdAt FROM study_log WHERE log_class = '${req.params.id}'`, function (err, result) {

                    for(var i = 0; i < result.length; i++) {
                        class_study_log.push({ id: result[i].log_id, user: result[i].log_user, createdAt: moment(result[i].createdAt).add(0, 'days').format('YYYY-MM-DD HH:mm:ss') })
                    }

                    return res.status(200).json({
                        success: true,
                        content: { name: class_name, des: class_des, position: class_position, invite_code: class_invite_code, students: class_students, words: class_words, study_log: class_study_log }
                    });
        
                });
    
            });

        });
        
        connection.release();

    });

});

router.post("/:id/study_log", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // log_data, log_user, log_words_id

    // 변수 선언
    let body = req.body;

    // 로그 추가 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    if(body.log_data.length > 100) {
        return res.status(404).json({
            success: false,
            message: 'The data is too long'
        });
    }

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {

                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }

                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                connection.query(`SELECT log_id FROM study_log WHERE log_class = '${req.params.id}'`, function (err, result) {

                    if(result.length >= 30) {
                        return res.status(404).json({
                            success: false,
                            message: 'You cannot make study log more than 30'
                        });
                    }

                    var final_add_log_data = body.log_data;
                    final_add_log_data = jwt.sign({ final_add_log_data },
                        process.env.JWT_SECRET
                    );
    
                    // 18자리의 숫자로 이루어진 랜덤한 로그 아이디를 생성함
                    function create_new_log_id() {
                        new_log_id = Math.floor(Math.random() * (999999999999999999 - 100000000000000000 + 1)) + 100000000000000000;
                        connection.query(`SELECT * FROM study_log WHERE log_id = '${new_log_id}'`, function (err, result) {
                            if(result == null || !result[0]) return;
                            else create_new_log_id();
                        });
                    }
                    create_new_log_id();
    
                    connection.query(`INSERT INTO study_log(log_id, log_class, log_user, log_wrong_words, log_words_id, createdAt, updatedAt) VALUES('${new_log_id}', '${req.params.id}', '${body.log_user}', '${final_add_log_data}', '${body.log_words_id}', '${today}', '${today}')`, function (err, result) {
    
                        if(result) {
                            // 로그 생성 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Add Study Log', 'Add Study Log Success ${new_log_id} with ${APIusername} data: ${final_add_log_data}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 로그 생성이 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 로그 생성 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Study Log', 'Add Study Log Failed(DB Error) with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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

    } catch(err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Add Study Log', 'Add Study Log Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });

    }

});

router.get("/:id/study_log/:log_id", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    getConnection((connection) => {

        connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {

            if(result.length <= 0 || result == null) {
                return res.status(404).json({
                    success: false,
                    message: 'The class does not exist'
                });
            }

            if(result[0].class_owner != APIusername) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not onwer of the class'
                });
            }

            connection.query(`SELECT log_id, log_class, log_user, log_words_id, log_wrong_words FROM study_log WHERE log_id = '${req.params.log_id}'`, function (err, result) {

                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The log does not exist'
                    });
                }
    
                if(result[0].log_class != req.params.id) {
                    return res.status(400).json({
                        success: false,
                        message: 'The class is not owner of the log'
                    });
                }

                let decoded_log_wrong_words;
                jwt.verify(result[0].log_wrong_words, process.env.JWT_SECRET,
                    function(err, decoded) {
                        if(decoded) {
                            decoded_log_wrong_words = decoded.final_add_log_data;

                            return res.status(200).json({
                                success: true,
                                content: { wrong_words: decoded_log_wrong_words, words_id: result[0].log_words_id }
                            });
                        }
                    }
                );
    
            });

        });
        
        connection.release();

    });

});

router.delete("/:id/study_log/:log_id", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 로그 삭제 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }
    
                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }
    
                connection.query(`SELECT log_id, log_class, log_user, log_wrong_words FROM study_log WHERE log_id = '${req.params.log_id}'`, function (err, result) {
    
                    if(result.length <= 0 || result == null) {
                        return res.status(404).json({
                            success: false,
                            message: 'The log does not exist'
                        });
                    }
        
                    if(result[0].log_class != req.params.id) {
                        return res.status(400).json({
                            success: false,
                            message: 'The class is not owner of the log'
                        });
                    }

                    connection.query(`DELETE FROM study_log WHERE log_id = '${req.params.log_id}'`, function (err, result) {
    
                        if(result) {
                            // 로그 삭제 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Delete Study Log', 'Delete Study Log Success ${req.params.log_id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 로그 삭제가 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 로그 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Study Log', 'Delete Study Log Failed(DB Error) ${req.params.log_id} with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Study Log', 'Delete Study Log Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }

});

router.put("/:id/study_log/:log_id", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    // 받아오는 데이터
    // log_data

    // 변수 선언
    let body = req.body;

    // 로그 수정 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    if(body.log_data.length > 100) {
        return res.status(404).json({
            success: false,
            message: 'The data is too long'
        });
    }

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {

                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }

                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                connection.query(`SELECT log_id, log_class, log_user, log_wrong_words FROM study_log WHERE log_id = '${req.params.log_id}'`, function (err, result) {
    
                    if(result.length <= 0 || result == null) {
                        return res.status(404).json({
                            success: false,
                            message: 'The log does not exist'
                        });
                    }
        
                    if(result[0].log_class != req.params.id) {
                        return res.status(400).json({
                            success: false,
                            message: 'The class is not owner of the log'
                        });
                    }

                    const before_log_change = result[0].log_wrong_words;

                    var final_add_log_data = body.log_data;
                    final_add_log_data = jwt.sign({ final_add_log_data },
                        process.env.JWT_SECRET
                    );

                    connection.query(`UPDATE study_log SET log_wrong_words = '${final_add_log_data}' WHERE log_id = '${req.params.log_id}'`, function (err, result) {
    
                        if(result) {
                            // 로그 삭제 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Edit Study Log', 'Edit Study Log Success ${req.params.log_id} with ${APIusername} from ${before_log_change} to ${final_add_log_data}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 로그 삭제가 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 로그 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Edit Study Log', 'Edit Study Log Failed(DB Error) ${req.params.log_id} with ${APIusername} from ${before_log_change} to ${final_add_log_data}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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

    } catch(err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Edit Study Log', 'Edit Study Log Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });

    }

});

router.delete("/:id/user/:user_name", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 학생 삭제 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }

                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                const now_class_students = result[0].class_students.split(',');
    
                connection.query(`SELECT class FROM user_info WHERE user_name = '${req.params.user_name}'`, function (err, result) {
    
                    if(result.length <= 0 || result == null) {
                        return res.status(404).json({
                            success: false,
                            message: 'The user does not exist'
                        });
                    }
        
                    if(result[0].class.split(',').indexOf(req.params.id) == -1) {
                        return res.status(400).json({
                            success: false,
                            message: 'The user is not student of the class'
                        });
                    }

                    const now_user_class = result[0].class.split(',');

                    let filtered_user_class = now_user_class.filter((element) => element !== req.params.id);
                    let filtered_class_students = now_class_students.filter((element) => element !== req.params.user_name);

                    connection.query(`UPDATE user_info SET class = '${filtered_user_class.toString()}' WHERE user_name = '${req.params.user_name}'`, function (err, result) {

                        if(!result) {
                            // 학생 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(DB Error) class: ${req.params.id} kick: ${req.params.user_name} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
    
                        connection.query(`UPDATE class_info SET class_students = '${filtered_class_students.toString()}' WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                            if(result) {
                                // 학생 삭제 성공을 시스템 로그에 기록
                                connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Kick Student', 'Kick Student Success class: ${req.params.id} kick: ${req.params.user_name} by ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(200).json({
                                        success: true
                                    }); // 학생 삭제가 성공됨을 최종적으로 리턴
                                });
                            } else {
                                // 학생 삭제 실패시 에러 로그에 기록
                                connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(DB Error) class: ${req.params.id} kick: ${req.params.user_name} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Unknown DB error'
                                    });
                                });
                            }
            
                        });
        
                    });
        
                });
    
            });
            
            connection.release();
    
        });
        
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }

});

router.delete("/:id/me", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 학생 삭제 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }

                const now_class_students = result[0].class_students.split(',');
    
                connection.query(`SELECT class FROM user_info WHERE user_name = '${APIusername}'`, function (err, result) {
    
                    if(result.length <= 0 || result == null) {
                        return res.status(404).json({
                            success: false,
                            message: 'The user does not exist'
                        });
                    }
        
                    if(result[0].class.split(',').indexOf(req.params.id) == -1) {
                        return res.status(400).json({
                            success: false,
                            message: 'The user is not student of the class'
                        });
                    }

                    const now_user_class = result[0].class.split(',');

                    let filtered_user_class = now_user_class.filter((element) => element !== req.params.id);
                    let filtered_class_students = now_class_students.filter((element) => element !== APIusername);

                    connection.query(`UPDATE user_info SET class = '${filtered_user_class.toString()}' WHERE user_name = '${APIusername}'`, function (err, result) {

                        if(!result) {
                            // 학생 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(DB Error) class: ${req.params.id} kick: ${APIusername} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
    
                        connection.query(`UPDATE class_info SET class_students = '${filtered_class_students.toString()}' WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                            if(result) {
                                // 학생 삭제 성공을 시스템 로그에 기록
                                connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Kick Student', 'Kick Student Success class: ${req.params.id} kick: ${APIusername} by ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(200).json({
                                        success: true
                                    }); // 학생 삭제가 성공됨을 최종적으로 리턴
                                });
                            } else {
                                // 학생 삭제 실패시 에러 로그에 기록
                                connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(DB Error) class: ${req.params.id} kick: ${APIusername} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Unknown DB error'
                                    });
                                });
                            }
            
                        });
        
                    });
        
                });
    
            });
            
            connection.release();
    
        });
        
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Kick Student', 'Kick Student Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }

});

router.put("/:id/invite_code", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 초대코드 변경 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }
    
                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                connection.query(`SELECT log_content FROM system_log WHERE DATE_FORMAT(log_date, "%Y-%m-%d") = CURDATE() AND log_content = 'Refresh Class Invite Code Success ${req.params.id} with ${APIusername}'`, function (err, result) {

                    if(result.length >= 3) {
                        return res.status(400).json({
                            success: false,
                            message: 'You cannot refresh the class invite code more than 3 times for a day'
                        });
                    }

                    var new_class_invite_code;

                    // 랜덤한 클래스 초대코드를 생성함
                    function create_new_class_invite_code() {
                        new_class_invite_code = Math.random().toString(36).substr(2,11);
                        connection.query(`SELECT class_name FROM class_info WHERE class_invite_code = '${new_class_invite_code}'`, function (err, result) {
                            if(result == null || !result[0]) return;
                            else create_new_class_invite_code();
                        });
                    }
                    create_new_class_invite_code();
    
                    connection.query(`UPDATE class_info SET class_invite_code = '${new_class_invite_code}' WHERE class_id = '${req.params.id}'`, function (err, result) {
        
                        if(result) {
                            // 초대코드 변경 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Refresh Class Invite Code', 'Refresh Class Invite Code Success ${req.params.id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 초대코드 변경이 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 초대코드 변경 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Refresh Class Invite Code', 'Refresh Class Invite Code Failed(DB Error) ${req.params.id} with ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Refresh Class Invite Code', 'Refresh Class Invite Code Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }

});

router.put("/:id", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 받아오는 데이터
    // name, des

    // 변수 선언
    let body = req.body;


    // 클래스 정보 변경 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    if(body.name.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'The name is too long'
        });
    }
    if(body.des.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'The des is too long'
        });
    }

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }
    
                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                const before_class_name = result[0].class_name, before_class_des = result[0].class_des
    
                connection.query(`UPDATE class_info SET class_name = '${body.name}', class_des = '${body.des}' WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                    if(result) {
                        // 클래스 정보 변경 성공을 시스템 로그에 기록
                        connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Change Class Info', 'Change Class Info Success ${req.params.id} with ${APIusername} from name: ${before_class_name} des: ${before_class_des} to name: ${body.name} des: ${body.des}', '${today}', '${Ip.address()}')`, function(err, result) {
                            return res.status(200).json({
                                success: true
                            }); // 클래스 정보 변경이 성공됨을 최종적으로 리턴
                        });
                    } else {
                        // 클래스 정보 변경 실패시 에러 로그에 기록
                        connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Change Class Info', 'Change Class Info Failed(DB Error) ${req.params.id} with ${APIusername} from name: ${before_class_name} des: ${before_class_des} to name: ${body.name} des: ${body.des}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                            return res.status(500).json({
                                success: false,
                                message: 'Unknown DB error'
                            });
                        });
                    }
    
                });
    
            });
            
            connection.release();
    
        });
        
    } catch (err) {

        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Change Class Info', 'Change Class Info Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
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

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 클래스 삭제 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        getConnection((connection) => {

            connection.query(`SELECT class_name, class_students, class_owner FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }
    
                if(result[0].class_owner != APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are not onwer of the class'
                    });
                }

                let class_students;
                if(result[0].class_students == null || result[0].class_students == '') class_students = [];
                else class_students = result[0].class_students.split(',');

                function delete_class_id_from_user_info(student_name) {
                    return new Promise(function(resolve, reject) {

                        connection.query(`SELECT class FROM user_info WHERE user_name = '${student_name}'`, function (err, result) {

                            var now_user_class = result[0].class.split(',');
        
                            let filtered_user_class = now_user_class.filter((element) => element !== req.params.id);
        
                            connection.query(`UPDATE user_info SET class = '${filtered_user_class.toString()}' WHERE user_name = '${student_name}'`, function (err, result) {
        
                                if(result) {
                                    resolve();
                                } else {
                                    // 학생 삭제 실패시 에러 로그에 기록
                                    connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Class', 'Delete Class Failed(DB Error)[delete class id on student info] class: ${req.params.id} kick: ${class_students[k]} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                        return res.status(500).json({
                                            success: false,
                                            message: 'Unknown DB error'
                                        });
                                    });
                                }
        
                            });
                        });

                    });
                }
                async function delete_class_id_from_all_user_info() {

                    for(var k = 0; k < class_students.length; k++) {
                        await delete_class_id_from_user_info(class_students[k]);
                    }
                    delete_class_words();

                }
                delete_class_id_from_all_user_info();


                function delete_class_words() {
                    connection.query(`DELETE FROM words_info WHERE words_owner = '${req.params.id}'`, function (err, result) {
    
                        if(result) {
                            delete_class_study_log();
                        } else {
                            // 단어장 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Class', 'Delete Class Failed(DB Error)[delete class words] class: ${req.params.id} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
        
                    });
                }
                function delete_class_study_log() {
                    connection.query(`DELETE FROM study_log WHERE log_class = '${req.params.id}'`, function (err, result) {
    
                        if(result) {
                            delete_class();
                        } else {
                            // 로그 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Class', 'Delete Class Failed(DB Error)[delete class study log] class: ${req.params.id} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
        
                    });
                }
                function delete_class() {
                    connection.query(`DELETE FROM class_info WHERE class_id = '${req.params.id}'`, function (err, result) {
    
                        if(result) {
                            // 클래스 삭제 성공을 시스템 로그에 기록
                            connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Delete Class', 'Delete Class Success ${req.params.id} with ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(200).json({
                                    success: true
                                }); // 클래스 삭제가 성공됨을 최종적으로 리턴
                            });
                        } else {
                            // 클래스 삭제 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Class', 'Delete Class Failed(DB Error)[delete class] class: ${req.params.id} by ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
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
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Delete Class', 'Delete Class Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
                return res.status(500).json({
                    success: false,
                    message: 'Unknown system error'
                });
            });

            connection.release();
        });
    }

});

router.get("/invite/:invite_code", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    getConnection((connection) => {

        connection.query(`SELECT class_name, class_des, class_invite_code, class_students, class_owner FROM class_info WHERE class_invite_code = '${req.params.invite_code}'`, function (err, result) {

            if(result.length <= 0 || result == null) {
                return res.status(404).json({
                    success: false,
                    message: 'The class does not exist'
                });
            }

            if(result[0].class_owner == APIusername) {
                return res.status(400).json({
                    success: false,
                    message: 'You are owner of the class'
                });
            }

            if(result[0].class_students != null) {
                if(result[0].class_students.split(',').indexOf(APIusername) != -1) {
                    return res.status(400).json({
                        success: false,
                        message: 'The user is already student of the class'
                    });
                }
            }

            let class_name = result[0].class_name;
            let class_des = result[0].class_des;
            let class_owner = result[0].class_owner;

            return res.status(200).json({
                success: true,
                content: { name: class_name, des: class_des, owner: class_owner }
            });

        });
        
        connection.release();

    });

});

router.post("/invite/:invite_code", function(req, res) {
    
    var APIusername = check_user(req.session);
    if(APIusername == 401) { // 유저 체크
        return res.redirect("/login"); // 로그인 페이지로 리다이렉트
    }

    if(!req.body.key || req.body.key != process.env.API_KEY) return res.status(401);

    // 클래스 참가 시간
    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        getConnection((connection) => {

            connection.query(`SELECT class_id, class_students, class_owner FROM class_info WHERE class_invite_code = '${req.params.invite_code}'`, function (err, result) {
    
                if(result.length <= 0 || result == null) {
                    return res.status(404).json({
                        success: false,
                        message: 'The class does not exist'
                    });
                }

                if(result[0].class_students != null) {
                    if(result[0].class_students.split(',').indexOf(APIusername) != -1) {
                        return res.status(400).json({
                            success: false,
                            message: 'The user is already student of the class'
                        });
                    }
                }

                if(result[0].class_owner == APIusername) {
                    return res.status(400).json({
                        success: false,
                        message: 'You are owner of the class'
                    });
                }
    
                let class_id = result[0].class_id;
    
                let now_class_students;
                if(result[0].class_students == null || result[0].class_students == '') now_class_students = [];
                else now_class_students = result[0].class_students.split(',');
        
                connection.query(`SELECT class FROM user_info WHERE user_name = '${APIusername}'`, function (err, result) {
    
                    if(result.length <= 0 || result == null) {
                        return res.status(404).json({
                            success: false,
                            message: 'The user does not exist'
                        });
                    }
    
                    let now_user_class;
                    if(result[0].class == null || result[0].class == '') now_user_class = [];
                    else now_user_class = result[0].class.split(',');

                    now_user_class.push(class_id);
                    now_class_students.push(APIusername);
    
                    connection.query(`UPDATE user_info SET class = '${now_user_class.toString()}' WHERE user_name = '${APIusername}'`, function (err, result) {
    
                        if(!result) {
                            // 클래스 참가 실패시 에러 로그에 기록
                            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Join Class', 'Join Class Failed(DB Error) class: ${class_id} user: ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Unknown DB error'
                                });
                            });
                        }
    
                        connection.query(`UPDATE class_info SET class_students = '${now_class_students.toString()}' WHERE class_id = '${class_id}'`, function (err, result) {
    
                            if(result) {
                                // 클래스 참가 성공을 시스템 로그에 기록
                                connection.query(`INSERT INTO system_log(log_type, log_content, log_date, log_ip) VALUES('Join Class', 'Join Class Success class: ${class_id} user: ${APIusername}', '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(200).json({
                                        success: true
                                    }); // 클래스 참가가 성공됨을 최종적으로 리턴
                                });
                            } else {
                                // 클래스 참가 실패시 에러 로그에 기록
                                connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Join Class', 'Join Class Failed(DB Error) class: ${class_id} user: ${APIusername}', "${err}", '${today}', '${Ip.address()}')`, function(err, result) {
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Unknown DB error'
                                    });
                                });
                            }
            
                        });
        
                    });
        
                });
    
            });
            
            connection.release();
    
        });
    } catch(err) {
        getConnection((connection) => {

            // js 내부 에러 발생시 에러 로그에 기록
            connection.query(`INSERT INTO system_error_log(log_type, log_content, log_error, log_date, log_ip) VALUES('Join Class', 'Join Class Failed(js Error)', '${err}', '${today}', '${Ip.address()}')`, function(err, result) {
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