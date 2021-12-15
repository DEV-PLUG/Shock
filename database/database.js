const mysql = require("mysql2");
require("dotenv").config();

let pool = mysql.createPool({
    host     : process.env.DATABASE_HOST,    // 호스트 주소
    user     : process.env.DATABASE_USER,           // mysql user
    password : process.env.DATABASE_PASSWORD,       // mysql password
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