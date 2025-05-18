const bcrypt = require('bcrypt');
const { LearningProgress, QuizProgress, StoryProgress } = require('../models');

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

/* 내 캐릭터 보기 (진행도 계산)
exports.renderCharacter = async (req, res) => {
  try {
    const user_character_id = req.user.user_character_id;

    // 학습모드 진행도
    const learningTotal = await LearningProgress.count({ where: { user_character_id } });
    const learningPassed = await LearningProgress.count({ where: { user_character_id, learning_pass: true } });
    const learningPassPercent = learningTotal > 0 
      ? Math.round(learningPassed / learningTotal * 100) 
      : 0;

    // 스토리모드 진행도
    const storyTotal = await StoryProgress.count({ where: { user_character_id } });
    const storyPassed = await StoryProgress.count({ where: { user_character_id, story_pass: true } });
    const storyPassPercent = storyTotal > 0 
      ? Math.round(storyPassed / storyTotal * 100) 
      : 0;

    // 퀴즈모드 진행도
    const quizTotal = await QuizProgress.count({ where: { user_character_id } });
    const quizPassed = await QuizProgress.count({ where: { user_character_id, quiz_pass: true } });
    const quizPassPercent = quizTotal > 0 
      ? Math.round(quizPassed / quizTotal * 100) 
      : 0;

    res.render('myCharacter', {
      user: req.user,
      learning_progress: { learning_pass: learningPassPercent },
      story_progress: { story_pass: storyPassPercent },
      quiz_progress: { quiz_pass: quizPassPercent }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
};
*/
