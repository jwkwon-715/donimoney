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
const expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainGameRouter = require('./routes/mainGame');
var quizRouter = require('./routes/quiz');
var quizOptionRouter = require('./routes/quizOption');
var quizProgressRouter = require('./routes/quizProgress');

var curriculumRouter = require('./routes/curriculum');
var storiesRouter = require('./routes/stories');
var jsonFilesRouter = require('./routes/jsonFiles');
var characterRouter = require('./routes/character');
const myPageRouter = require('./routes/myPage');

var app = express();
const db = require('./models'); // index.js가 있는 models 폴더
const UserCharacters = db.UserCharacters;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 기본 미들웨어 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);  // passport 설정 적용

app.use('/game', async (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;

  try {
    if (req.isAuthenticated?.() && req.session?.passport?.user?.user_character_id) {
      const userCharacterId = req.session.passport.user.user_character_id;

      const user = await UserCharacters.findOne({
        where: { user_character_id: userCharacterId }
      });

      res.locals.userMoney = user?.money || 0;
    } else {
      res.locals.userMoney = 0;
    }
  } catch (err) {
    console.error(err);
    res.locals.userMoney = 0;
  }

  next();
});

app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

//사용자 보유 돈 보여주기
app.use(async (req, res, next) => {
  
  next();
});

app.use('/game/school/quiz/select', (req, res, next) => {
  res.locals.showHomeAndCloseButtons = false;
  next();
});

app.use((req, res, next) => {
  res.locals.showHomeAndCloseButtons = false; // 기본값
  next();
});

app.use((req, res, next) => {
  const showBtns = [/^\/game/, /^\/quiz\/start/];
  res.locals.showHomeAndCloseButtons = showBtns.some(pattern => pattern.test(req.originalUrl));
  // console.log("▶️", req.originalUrl, "→ showHomeAndCloseButtons:", res.locals.showHomeAndCloseButtons);
  next();
});

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
app.use('/jsonFiles', jsonFilesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

if (process.env.SKIP_DB_SYNC === 'true') {
  console.log('!!!SKIP_DB_SYNC=true, DB sync 생략하고 서버만 실행');
} else {
  db.sequelize.sync()
    .then(() => {
      console.log('연결 성공');
    })
    .catch((err) => {
      console.error('실패:', err);
    });
}

// 에러 핸들러
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000); //로컬 환경 포트번호

module.exports = app;
