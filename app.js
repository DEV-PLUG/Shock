// ---------------------/ 임포팅 /---------------------//
const express = require('express');
const rateLimit = require("express-rate-limit"); 
const session = require('express-session');
const path = require('path');
const os = require('os');

const app = express();

require("dotenv").config();
const port = 3000;

// 보안 설정
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.expectCt());
app.use(helmet.referrerPolicy());
app.use(helmet.ieNoOpen());

// views 파일 지정
app.set('views', path.join(__dirname, './src/views'));
app.use(express.static(path.join(__dirname, './src')));

// ejs 파일로 변환
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json({limit: '50mb'}));

// ----------------------------------------------------//

// ---------------- 쿠키 및 레이트 리밋 ----------------//

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use("/api/", rateLimit({ 
    windowMs: 1 * 60 * 1000, 
    max: 200
    })
);
app.use(rateLimit({ 
    windowMs: 1 * 60 * 1000, 
    max: 1000
    })
);

// ----------------------------------------------------//

// -------------------- 라우팅 연결 --------------------//

var HomeRouter = require('./routes/home');
var LoginRouter = require('./routes/login');
var SignupRouter = require('./routes/signup');
var DashboardRouter = require('./routes/dashboard');
var TableRouter = require('./routes/table');
var MobileRouter = require('./routes/mobile');

app.use('/dashboard', DashboardRouter);
app.use('/mobile', MobileRouter);
app.use('/', HomeRouter);
app.use('/login', LoginRouter);
app.use('/signup', SignupRouter);
app.use('/table', TableRouter);

var APISignupRouter = require('./API/signup');
var APILoginRouter = require('./API/login');
var APILogoutRouter = require('./API/logout');
var APIWordsRouter = require('./API/words');

app.use('/logout', APILogoutRouter);

/*------------------/ API /------------------*/

app.use('/api/signup', APISignupRouter);
app.use('/api/login', APILoginRouter);
app.use('/api/words', APIWordsRouter);

// ----------------------------------------------------//

// ----------------------------------------------------//

app.listen(port, () => {
  console.log(`App listening at http://${os.hostname}:${port}`);
  console.log(`PID : ${process.pid}`);
});

// ----------------------------------------------------//