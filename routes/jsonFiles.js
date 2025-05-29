const express = require('express');
const router = express.Router();
const { JsonFiles } = require('../models');
const multer = require('multer');
const fs = require('fs/promises');

const upload = multer({ dest: 'uploads/' });

// 모든 JSON 파일 목록 조회
router.get('/', async (req, res) => {
  try {
    const files = await JsonFiles.findAll({
      attributes: ['json_id', 'json_name'] // 필요 필드만 선택
    });
    res.json({ status: 'success', data: files });
  } catch (error) {
    res.status(500).json({ status: 'error', message: '서버 오류', error: error.message });
  }
});

// 특정 파일 조회 (json_name 기준)
router.get('/:json_name', async (req, res) => {
  try {
    const json_name = req.params.json_name.endsWith('.json') 
      ? req.params.json_name 
      : `${req.params.json_name}.json`;

    const file = await JsonFiles.findOne({ 
      where: { json_name },
      attributes: ['json_id', 'json_name', 'json_content']
    });

    if (!file) {
      return res.status(404).json({ 
        status: 'error', 
        message: '파일을 찾을 수 없습니다' 
      });
    }

    res.json({ status: 'success', data: file });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: '서버 오류', 
      error: err.message 
    });
  }
});

// JSON 파일 업로드 및 DB 저장
router.post('/upload', upload.single('json_content'), async (req, res) => {
  try {
    const { story_id } = req.body;

    if (!story_id) {
      return res.status(400).json({
        status: 'error',
        message: 'story_id는 필수 항목입니다'
      });
    }

    const json_name = req.file.originalname.endsWith('.json') 
      ? req.file.originalname 
      : `${req.file.originalname}.json`;

    const filePath = req.file.path;
    const rawData = await fs.readFile(filePath, 'utf8');

    let jsonContent;
    try {
      jsonContent = JSON.parse(rawData);
    } catch (err) {
      await fs.unlink(filePath);
      return res.status(400).json({
        status: 'error',
        message: '유효하지 않은 JSON 파일입니다'
      });
    }

    const [record, created] = await JsonFiles.upsert({
      json_name,
      json_content: jsonContent,
      story_id: parseInt(story_id, 10)
    });

    await fs.unlink(filePath);

    res.status(created ? 201 : 200).json({
      status: 'success',
      message: created ? '파일이 저장되었습니다' : '파일이 업데이트되었습니다',
      data: record
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '파일 업로드 실패',
      error: error.message
    });
  }
});


module.exports = router;
