const mysql = require("mysql2");

let pool = mysql.createPool({
    host     : 'localhost',    // 호스트 주소
    user     : 'root',           // mysql user
    password : 'rootpassword',       // mysql password
    database : 'shock'         // mysql 데이터베이스
});

function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        } else {
            console.log(err)
        }
    });
}

module.exports = getConnection;