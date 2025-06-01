// routes/quizProgress.js
const express = require('express');
const router = express.Router();
const { QuizProgress } = require('../models'); // 모델에서 QuizProgress 가져오기

// 퀴즈 진행률 전체 조회
router.get('/', async (req, res) => {
  try {
    const quizProgresses = await QuizProgress.findAll();
    res.json(quizProgresses);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 진행률을 불러오는 데 실패했습니다.' });
  }
});

// 특정 유저의 퀴즈 진행 상태 조회
router.get('/user/:user_character_id', async (req, res) => {
  const { user_character_id } = req.params;
  try {
    const quizProgress = await QuizProgress.findAll({
      where: { user_character_id }
    });
    if (quizProgress.length === 0) {
      return res.status(404).json({ error: '해당 유저의 퀴즈 진행 상태가 없습니다.' });
    }
    res.json(quizProgress);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 진행 상태를 불러오는 데 실패했습니다.', details: err.message });
  }
});

// 퀴즈 진행률 추가
router.post('/', async (req, res) => {
  const { quiz_pass, user_character_id, curriculum_id } = req.body;
  try {
    const newQuizProgress = await QuizProgress.create({
      quiz_pass,
      user_character_id,
      curriculum_id
    });
    res.status(201).json(newQuizProgress);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 진행률 생성 실패', details: err.message });
  }
});

// 퀴즈 진행률 수정
router.put('/:quiz_progress_id', async (req, res) => {
  const { quiz_progress_id } = req.params;
  const { quiz_pass } = req.body;
  try {
    const quizProgress = await QuizProgress.findByPk(quiz_progress_id);
    if (!quizProgress) {
      return res.status(404).json({ error: '퀴즈 진행률을 찾을 수 없습니다.' });
    }
    quizProgress.quiz_pass = quiz_pass;
    await quizProgress.save();
    res.json(quizProgress);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 진행률 수정 실패', details: err.message });
  }
});

// 퀴즈 진행률 삭제
router.delete('/:quiz_progress_id', async (req, res) => {
  const { quiz_progress_id } = req.params;
  try {
    const quizProgress = await QuizProgress.findByPk(quiz_progress_id);
    if (!quizProgress) {
      return res.status(404).json({ error: '퀴즈 진행률을 찾을 수 없습니다.' });
    }
    await quizProgress.destroy();
    res.json({ message: '퀴즈 진행률이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '퀴즈 진행률 삭제 실패', details: err.message });
  }
});

module.exports = router;
