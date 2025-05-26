const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입
router.get('/signup', (req, res) => {
  res.render('signup', {
    error: req.flash('error'),
    success: req.flash('success'),
    note: req.flash('note')
  });
});
router.post('/signup', userController.signup);

// 로그인
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error'),
    success: req.flash('success'),
    note: req.flash('note')
  });
});
router.post('/login', userController.login);

// 로그아웃
router.get('/logout', userController.logout);

// 아이디/비밀번호 찾기
router.get('/find', userController.getFindPage);
router.post('/find-id', userController.findId);
router.post('/find-pw', userController.findPw);

// 비밀번호 재설정
router.get('/reset-password/:user_id/:token', userController.getResetPassword);
router.post('/reset-password/:user_id/:token', userController.resetPassword);

module.exports = router;
