const express = require('express');
const router = express.Router();
const myPageController = require('../controllers/myPageController');

// 로그인 체크 미들웨어
function isAuthenticated(req, res, next) {
  if (req.user) return next();
  res.redirect('/users/login');
}

// 마이페이지 메인
router.get('/', isAuthenticated, myPageController.renderMain);

// 내 정보 확인 - 비밀번호 입력 폼
router.get('/info-check', isAuthenticated, myPageController.renderInfoCheck);

// 아이디/비밀번호 변경 - 비밀번호 입력 폼
router.get('/change-account-check', isAuthenticated, myPageController.renderChangeAccountCheck);

// 공통 비밀번호 검사
router.post('/check-password', isAuthenticated, myPageController.checkPassword);

// 내 정보 표시
router.get('/info', isAuthenticated, myPageController.renderInfo);

// 내 캐릭터 보기 (진행도 계산)
//router.get('/character', isAuthenticated, myPageController.renderCharacter);

module.exports = router;
