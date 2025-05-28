const bcrypt = require('bcrypt');
const { Curriculum, Learning, LearningProgress, QuizProgress, StoryProgress, 
  Stories, UserCharacters, Inventory, Items } = require('../models');
const { Sequelize, where } = require('sequelize');


// 마이페이지 메인
exports.renderMain = (req, res) => {
  res.render('myPage', { user: req.user });
};

// 내 정보 확인 - 비밀번호 입력 폼
exports.renderInfoCheck = (req, res) => {
  res.render('infoCheck', { error: null, nextUrl: '/mypage/info' });
};

// 아이디/비밀번호 변경 - 비밀번호 입력 폼
exports.renderChangeAccountCheck = (req, res) => {
  res.render('infoCheck', { error: null, nextUrl: '/users/find' });
};

// 공통 비밀번호 검사
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

// 내 정보 표시
exports.renderInfo = (req, res) => {
  res.render('info', { user: req.user });
};

// 마이캐릭터 페이지
exports.renderCharacter = async (req, res) => {
  try {
    const userCharacterId = req.user.user_character_id;
    const character = await UserCharacters.findByPk(userCharacterId);

    // 캐릭터가 없을 때 안내 메시지
    if (!character) {
      return res.render('myCharacter', {
        character: null,
        noCharacterMsg: '캐릭터가 없습니다. 시작하기를 눌러 캐릭터를 먼저 생성해주세요!',
      });
    }

    // 학습 진도율
    const totalLearning = await Learning.count();
    const passedLearning = await LearningProgress.findAll({
      attributes: [[Sequelize.col('learning_id'), 'learning_id']],
      where: { user_character_id: userCharacterId, learning_pass: true },
      group: ['learning_id']
    });
    const passedLearningCount = passedLearning.length;
    const percentLearning = totalLearning > 0 ? Math.round((passedLearningCount / totalLearning) * 100) : 0;

    // 퀴즈 진도율 (quiz_id가 없다면 row 개수 기준)
    const totalQuiz = await Curriculum.count();
    const passedQuiz = await QuizProgress.count({ where: { user_character_id: userCharacterId, quiz_pass: true } });
    const percentQuiz = totalQuiz > 0 ? Math.round((passedQuiz / totalQuiz) * 100) : 0;

    // 스토리 진도율 (story_id 기준)
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
      // 학습
      totalLearning,
      passedLearningCount,
      percentLearning,
      // 퀴즈
      totalQuiz,
      passedQuiz,
      percentQuiz,
      // 스토리
      totalStory,
      passedStoryCount,
      percentStory,
      noCharacterMsg: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
};

exports.renderInventory = async(req, res) => {
  const userCharacterId = req.user.user_character_id;

  const inventory = await Inventory.findAll({
    where: {user_character_id: userCharacterId},
    include: [{
      model: Items,
      require: true
    }],
  })

  res.render('inventory', {inventory});

}
