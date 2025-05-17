const learningController = require("../controllers/game/learningController");
const quizController = require("../controllers/game/quizController");

const express = require("express"),
    router = express.Router(),
    mainController = require("../controllers/game/mainController"),
    martController = require("../controllers/game/martController");

router.get("/main", mainController.renderMain);

router.get("/home", mainController.renderHome);

router.get("/mart/itemList", mainController.renderMart);
router.post("/mart/itemList/buy", martController.buy);

router.get("/school", mainController.renderSchool);
router.get("/school/quiz/typeList", quizController.renderQuizTypeList);
router.get("/school/quiz/select/general", quizController.showPossibleQuizList, quizController.renderQuizList);
router.get("/school/quiz/select/random", quizController.showPossibleQuizList, quizController.renderRandomQuizList);
router.post("/school/quiz/select", quizController.solveQuiz);  //두개의 퀴즈 문제 요청은 하나의 라우터에서 해결
router.post("/school/quiz/complete", quizController.updateQuizProg, mainController.renderHome);

router.get("/school/learning/list", learningController.renderLearningList);
router.get("/school/learning/content/:learningId", learningController.renderLearningContent);
router.post("/school/learning/complete", learningController.updateLearningProgress, mainController.renderHome);

module.exports = router;