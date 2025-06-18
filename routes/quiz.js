// routes/quiz.js
const express = require('express');
const router = express.Router();
const { Quiz } = require('../models'); // models/index.js에서 Quiz 가져오기

// 퀴즈 전체 조회
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: '퀴즈를 불러오는 데 실패했습니다.' });
  }
});

// 퀴즈 추가
router.post('/', async (req, res) => {
  try {
    const { question, answer, solution, curriculum_id } = req.body;
    const quiz = await Quiz.create({ question, answer, solution, curriculum_id });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 생성 실패', details: err.message });
  }
});

module.exports = router;