const express = require('express');
const router = express.Router();
const { UserCharacters } = require('../models');

// 로그인 체크 미들웨어
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

// 캐릭터 생성 페이지 렌더링
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('characterCreate');  // views/characterCreate.ejs 필요
});

// 캐릭터 생성 처리
router.post('/create', ensureAuthenticated, async (req, res) => {
  const { characterName } = req.body;
  const userId = req.user.user_id;

  if (!characterName || characterName.trim() === '') {
    return res.send('캐릭터 이름을 입력해주세요.');
  }

  try {
    await UserCharacters.create({
      user_id: userId,
      nickname: characterName.trim(),
    });

    res.redirect('/game/home');
  } catch (error) {
    console.error(error);
    res.send('캐릭터 생성 중 오류가 발생했습니다.');
  }
});

module.exports = router;
