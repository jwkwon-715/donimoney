const express = require('express');
const router = express.Router();
const { Curriculum } = require('../models'); 

router.get('/', async (req, res) => {
  try {
    const curriculums = await Curriculum.findAll();
    res.json(curriculums);
  } catch (error) {
    console.error('커리큘럼 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { curriculum_title, description } = req.body;
    if (!curriculum_title) {
      return res.status(400).json({ message: "curriculum_title은 필수입니다." });
    }

    const newCurriculum = await Curriculum.create({
      curriculum_title,
      description
    });

    res.status(201).json(newCurriculum);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
