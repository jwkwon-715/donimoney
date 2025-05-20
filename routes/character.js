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

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { characterName } = req.body;
  const userId = req.user.user_id;

  if (!characterName || characterName.trim() === '') {
    return res.send('캐릭터 이름을 입력해주세요.');
  }

  try {
    const newCharacter = await UserCharacters.create({
      user_id: userId,
      nickname: characterName.trim(),
    });

    // req.user에 user_character_id를 반영
    req.user.user_character_id = newCharacter.user_character_id;

    // 세션 갱신: req.login으로 serializeUser를 다시 실행
    req.login(req.user, (err) => {
      if (err) {
        console.error(err);
        return res.send('세션 갱신 중 오류가 발생했습니다.');
      }
      res.redirect('/game/home');
    });
  } catch (error) {
    console.error(error);
    res.send('캐릭터 생성 중 오류가 발생했습니다.');
  }
});

module.exports = router;
