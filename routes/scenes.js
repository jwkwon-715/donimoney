const express = require('express');
const router = express.Router();
const { Scenes } = require('../models'); // Sequelize 모델 import

// GET /scene
router.get('/', async (req, res) => {
  try {
    const scenes = await Scenes.findAll();
    res.json(scenes);
  } catch (error) {
    console.error('씬 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
