const express = require('express');
const router = express.Router();
const { Stories } = require('../models'); // Sequelize models 폴더 import


router.get('/storyList', async (req, res) => {
  try {
    const storyList = await Stories.findAll({ 
      attributes: ['story_id', 'story_title', 'simple_description']
    });
    res.render('game/storyList', { storyList });
  } catch (err) {
    res.status(500).send('스토리 목록을 불러올 수 없습니다.');
  }
});

// 전체 스토리 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const stories = await Stories.findAll();
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류: 스토리 목록을 불러올 수 없습니다.' });
  }
});

// 특정 스토리 ID로 가져오기
router.get('/:storyId', async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const storyData = await Stories.findOne({ 
      where: { story_id: storyId } 
    });
    res.render('game/storyScene', { 
      storyData,
      storyId: storyId 
    });
  } catch (err) {
    res.status(500).send('스토리를 불러올 수 없습니다.');
  }
});


// 새 스토리 생성
router.post('/', async (req, res) => {
  try {
    const { story_title, simple_description, curriculum_id } = req.body;

    const newStory = await Stories.create({
      story_title,
      simple_description,
      curriculum_id
    });

    res.status(201).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: '스토리 생성 실패', details: err.message });
  }
});

module.exports = router;
