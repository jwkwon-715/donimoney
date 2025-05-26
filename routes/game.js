const express = require('express');
const router = express.Router();
const { UserCharacters } = require('../models');

// 로그인 체크 미들웨어
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  res.redirect('/users/login');
}

// 게임 시작 처리 (캐릭터 확인 후 이동)
router.get('/start', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const character = await UserCharacters.findOne({ where: { user_id: userId } });

    if (!character) {
      // 캐릭터 없으면 생성 페이지로 이동
      return res.redirect('/character/create');
    }

    // 캐릭터 있으면 게임 홈으로 이동
    res.redirect('/game/home');
  } catch (error) {
    console.error(error);
    res.send('오류가 발생했습니다.');
  }
});

// 게임 홈 화면 렌더링
router.get('/home', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const character = await UserCharacters.findOne({ where: { user_id: userId } });

    if (!character) {
      return res.redirect('/character/create');
    }

    res.render('gameHome', {
      user: req.user,
      nickname: character.nickname,
    });
  } catch (error) {
    console.error(error);
    res.send('게임 홈 로딩 중 오류가 발생했습니다.');
  }
});

module.exports = router;
