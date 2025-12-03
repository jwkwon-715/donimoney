const express = require('express');
const router = express.Router();

const { UserCharacters } = require('../models');

// 컨트롤러 require
const mainController = require("../controllers/game/mainController");
const martController = require("../controllers/game/martController");
const learningController = require("../controllers/game/learningController");
const quizController = require("../controllers/game/quizController");
const storyController = require("../controllers/game/storyController");
const buyTestController = require('../controllers/game/buyTest');  //테스트용 컨트롤러

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
    res.redirect('/game/main');
  } catch (error) {
    console.error(error);
    res.send('오류가 발생했습니다.');
  }
});

// 게임 메인  화면 렌더링 (캐릭터 확인 및 닉네임 전달)
router.get('/main', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const character = await UserCharacters.findOne({ where: { user_id: userId } });

    if (!character) {
      return res.redirect('/character/create');
    }

    // views/game/main.ejs 렌더링
    res.render('game/main', {
      user: req.user,
      nickname: character.nickname,
    });
  } catch (error) {
    console.error(error);
    res.send('게임 메인인 로딩 중 오류가 발생했습니다.');
  }
});

router.get("/home", mainController.renderHome);

// ----- 마트/학교/퀴즈/학습/스토리 라우트 -----

// 마트
router.get("/mart/itemList", ensureAuthenticated, mainController.renderMart);
router.post("/mart/itemList/buy", ensureAuthenticated, martController.buy);
router.post('/mart/itemList/buy-test', buyTestController.buy); //성능 평가용 테스트 라우트
router.post('/mart/itemList/buy-test-new', buyTestController.buyNew); //성능 평가용 테스트 라우트

// 학교
router.get("/school", ensureAuthenticated, mainController.renderSchool);

// 퀴즈
router.get("/school/quiz/typeList", ensureAuthenticated, quizController.renderQuizTypeList);
router.get("/school/quiz/select/general", ensureAuthenticated, quizController.showPossibleQuizList, quizController.renderQuizList);
router.get("/school/quiz/select/random", ensureAuthenticated, quizController.showPossibleQuizList, quizController.renderRandomQuizList);
router.post("/school/quiz/select", ensureAuthenticated, quizController.solveQuiz);  // 두개의 퀴즈 문제 요청은 하나의 라우터에서 해결
router.post("/school/quiz/complete", ensureAuthenticated, quizController.updateQuizProg, async (req, res) => {
  // 퀴즈 완료 후 /main으로 이동
  res.redirect('/game/main');
});
router.get("/school/quiz/success", ensureAuthenticated, quizController.renderQuizSuccess);
router.get("/school/quiz/fail", ensureAuthenticated, quizController.renderQuizFail);

// 학습
router.get("/school/learning/list", ensureAuthenticated, learningController.renderLearningList);
router.get("/school/learning/content/:learningId", ensureAuthenticated, learningController.renderLearningContent);
router.post("/school/learning/complete", ensureAuthenticated, learningController.updateLearningProgress, async (req, res) => {
  // 학습 완료 후 /main으로 이동
  res.redirect('/game/main');
});


router.get(
  "/stories/storyList",
  ensureAuthenticated,
  storyController.showPossibleStoryList,
  storyController.hasUnlockItem,
  storyController.renderStoriesList    
);
router.post('/stories/complete', ensureAuthenticated, storyController.updateStoryProg);

module.exports = router;
