const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', userController.signup);

// 로그인
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', userController.login);

// 로그아웃
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// 아이디/비밀번호 찾기 페이지
router.get('/find', (req, res) => {
  res.render('findAccount');
});

router.post('/find', async (req, res) => {
  const { email } = req.body;
  // 나중에 아이디/비밀번호 찾기 기능 구현 예정
  res.send(`<p>${email} 으로 아이디/비밀번호 찾기 처리가 진행됩니다. (기능 구현 중)</p><a href="/users/login">로그인으로 돌아가기</a>`);
});

module.exports = router;
