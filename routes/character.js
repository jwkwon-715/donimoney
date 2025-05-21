const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// 로그인 체크 미들웨어
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

// 캐릭터 생성 페이지 렌더링
router.get('/create', ensureAuthenticated, characterController.renderCreate);

// 캐릭터 생성 처리
router.post('/create', ensureAuthenticated, characterController.createCharacter);

module.exports = router;
