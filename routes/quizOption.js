// routes/quizOption.js
const express = require('express');
const router = express.Router();
const { QuizOption } = require('../models'); // 모델에서 QuizOption 가져오기

// 퀴즈 선택지 전체 조회
router.get('/', async (req, res) => {
  try {
    const quizOptions = await QuizOption.findAll();
    res.json(quizOptions);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 선택지를 불러오는 데 실패했습니다.' });
  }
});

// 특정 퀴즈의 선택지 조회
router.get('/quiz/:quiz_id', async (req, res) => {
  const { quiz_id } = req.params;
  try {
    const quizOptions = await QuizOption.findAll({ where: { quiz_id } });
    if (quizOptions.length === 0) {
      return res.status(404).json({ error: '선택지가 없습니다.' });
    }
    res.json(quizOptions);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 선택지를 불러오는 데 실패했습니다.', details: err.message });
  }
});

// 퀴즈 선택지 추가
router.post('/', async (req, res) => {
  const { quiz_id, quiz_option_index, quiz_option_content } = req.body;
  try {
    const newQuizOption = await QuizOption.create({
      quiz_id,
      quiz_option_index,
      quiz_option_content
    });
    res.status(201).json(newQuizOption);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 선택지 생성 실패', details: err.message });
  }
});

// 퀴즈 선택지 수정
router.put('/:quiz_option_id', async (req, res) => {
  const { quiz_option_id } = req.params;
  const { quiz_option_index, quiz_option_content } = req.body;
  try {
    const quizOption = await QuizOption.findByPk(quiz_option_id);
    if (!quizOption) {
      return res.status(404).json({ error: '선택지를 찾을 수 없습니다.' });
    }
    quizOption.quiz_option_index = quiz_option_index;
    quizOption.quiz_option_content = quiz_option_content;
    await quizOption.save();
    res.json(quizOption);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 선택지 수정 실패', details: err.message });
  }
});

// 퀴즈 선택지 삭제
router.delete('/:quiz_option_id', async (req, res) => {
  const { quiz_option_id } = req.params;
  try {
    const quizOption = await QuizOption.findByPk(quiz_option_id);
    if (!quizOption) {
      return res.status(404).json({ error: '선택지를 찾을 수 없습니다.' });
    }
    await quizOption.destroy();
    res.json({ message: '선택지가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '퀴즈 선택지 삭제 실패', details: err.message });
  }
});

module.exports = router;
