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

module.exports = router;
