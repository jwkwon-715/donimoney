const { UserCharacters } = require('../models');

exports.renderCreate = (req, res) => {
  res.render('characterCreate');
};

exports.createCharacter = async (req, res) => {
  const { characterName } = req.body;
  const userId = req.user.user_id;

  if (!characterName || characterName.trim() === '') {
    return res.send('캐릭터 이름을 입력해주세요.');
  }

  try {
    const newCharacter = await UserCharacters.create({
      user_id: userId,
      nickname: characterName.trim(),
      money: 1000
    });

    req.user.user_character_id = newCharacter.user_character_id;

    req.login(req.user, (err) => {
      if (err) {
        console.error(err);
        return res.send('세션 갱신 중 오류가 발생했습니다.');
      }
      res.redirect('/game/main');
    });
  } catch (error) {
    console.error(error);
    res.send('캐릭터 생성 중 오류가 발생했습니다.');
  }
};
