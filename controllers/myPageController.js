const bcrypt = require('bcrypt');
const { Curriculum, Learning, LearningProgress, QuizProgress, StoryProgress, 
  Stories, UserCharacters, Inventory, Items } = require('../models');
const { Sequelize, where } = require('sequelize');


exports.renderMain = (req, res) => {
  res.render('myPage', { user: req.user });
};

// 내 정보 확인 비밀번호 입력
exports.renderInfoCheck = (req, res) => {
  res.render('infoCheck', { error: null, nextUrl: '/mypage/info' });
};

// 아이디/비밀번호 변경 비밀번호 입력
exports.renderChangeAccountCheck = (req, res) => {
  res.render('infoCheck', { error: null, nextUrl: '/users/find' });
};

// 비밀번호 검사
exports.checkPassword = async (req, res) => {
  const { password, nextUrl } = req.body;
  const user = req.user;
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    res.redirect(nextUrl);
  } else {
    res.render('infoCheck', { 
      error: '비밀번호가 일치하지 않습니다.',
      nextUrl: nextUrl 
    });
  }
};

exports.renderInfo = (req, res) => {
  res.render('info', { user: req.user });
};

exports.renderCharacter = async (req, res) => {
  try {
    const userCharacterId = req.user.user_character_id;
    const character = await UserCharacters.findByPk(userCharacterId);

    if (!character) {
      return res.render('myCharacter', {
        character: null,
        noCharacterMsg: '캐릭터가 없습니다. 시작하기를 눌러 캐릭터를 먼저 생성해주세요!',
        activeTab: 'character'
      });
    }

    const totalLearning = await Learning.count();
    const passedLearning = await LearningProgress.findAll({
      attributes: [[Sequelize.col('learning_id'), 'learning_id']],
      where: { user_character_id: userCharacterId, learning_pass: true },
      group: ['learning_id']
    });
    const passedLearningCount = passedLearning.length;
    const percentLearning = totalLearning > 0 ? Math.round((passedLearningCount / totalLearning) * 100) : 0;

    const totalQuiz = await Curriculum.count();
    const passedQuiz = await QuizProgress.count({ where: { user_character_id: userCharacterId, quiz_pass: true } });
    const percentQuiz = totalQuiz > 0 ? Math.round((passedQuiz / totalQuiz) * 100) : 0;

    const totalStory = await Stories.count();
    const passedStory = await StoryProgress.findAll({
      attributes: [[Sequelize.col('story_id'), 'story_id']],
      where: { user_character_id: userCharacterId, story_pass: true },
      group: ['story_id']
    });
    const passedStoryCount = passedStory.length;
    const percentStory = totalStory > 0 ? Math.round((passedStoryCount / totalStory) * 100) : 0;

    res.render('myCharacter', {
      character,
      totalLearning,
      passedLearningCount,
      percentLearning,
      totalQuiz,
      passedQuiz,
      percentQuiz,
      totalStory,
      passedStoryCount,
      percentStory,
      noCharacterMsg: null,
      activeTab: 'character'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
};

exports.renderInventory = async (req, res) => {
  try {
    const userCharacterId = req.user.user_character_id;

    const inventory = await Inventory.findAll({
      where: { user_character_id: userCharacterId },
      include: [{ model: Items, require: true }],
    });

    const character = await UserCharacters.findByPk(userCharacterId);
    const nickname = character && character.nickname ? character.nickname : '토롱이';

    res.render('inventory', {
      inventory,
      character,
      nickname,
      activeTab: 'inventory'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
};