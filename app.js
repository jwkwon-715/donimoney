require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportConfig = require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainGameRouter = require('./routes/mainGame');
var quizRouter = require('./routes/quiz');
var quizOptionRouter = require('./routes/quizOption');
var quizProgressRouter = require('./routes/quizProgress');

var curriculumRouter = require('./routes/curriculum');
var storiesRouter = require('./routes/stories');
var scenesRouter = require('./routes/scenes');
var dialoguesRouter = require('./routes/dialogues');
var storyCharacterRouter = require('./routes/storyCharacter');
var appearRouter = require('./routes/appear');
var choiceRouter = require('./routes/choice');
var jsonFilesRouter = require('./routes/jsonFiles');
var characterRouter = require('./routes/character');
const myPageRouter = require('./routes/myPage');

var app = express();
const db = require('./models'); // index.js가 있는 models 폴더

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 기본 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션과 passport 설정은 라우터보다 먼저!
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash()); // 이 줄 추가!!
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);  // passport 설정 적용

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// 쿼리 파라미터를 EJS에서 사용할 수 있도록 설정 추가
app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

// 🔽 라우터는 passport 설정 이후에 등록해야 함!
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', mainGameRouter);
app.use('/character', characterRouter);
app.use('/mypage', myPageRouter);
app.use('/quiz', quizRouter);
app.use('/quizOption', quizOptionRouter);
app.use('/quizProgress', quizProgressRouter);
app.use('/curriculum', curriculumRouter);
app.use('/stories', storiesRouter);
app.use('/scenes', scenesRouter);
app.use('/dialogues', dialoguesRouter);
app.use('/storyCharacter', storyCharacterRouter);
app.use('/appear', appearRouter);
app.use('/choice', choiceRouter);
app.use('/jsonfiles', jsonFilesRouter);

// 404 에러 처리
app.use(function(req, res, next) {
  next(createError(404));
});

// DB 연결
db.sequelize.sync()
  .then(() => {
    console.log('✅ 데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('❌ 데이터베이스 연결 실패:', err);
  });

// 에러 핸들러
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000); //로컬 환경 포트번호

module.exports = app;


