const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const axios = require('axios'); //  아임포트 인증을 위한 axios 추가

// ✅ 회원가입 페이지
router.get('/signup', (req, res) => {
  res.render('signup', {
    error: req.flash('error'),
    success: req.flash('success'),
    note: req.flash('note'),
    verified: req.session.verified || false //  세션에서 인증 여부 전달
  });
});

// ✅ 회원가입 처리
router.post('/signup', userController.signup);

// ✅ 로그인 페이지
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error'),
    success: req.flash('success'),
    note: req.flash('note')
  });
});

// ✅ 로그인 처리
router.post('/login', userController.login);

// ✅ 로그아웃 처리
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


// ✅ 아임포트 인증 라우터 (POST /verify)
router.post('/verify', async (req, res) => {
  const { imp_uid } = req.body;

  try {
    // 1. 아임포트 액세스 토큰 발급
    const tokenRes = await axios.post("https://api.iamport.kr/users/getToken", {
      imp_key: process.env.IAMPORT_API_KEY,
      imp_secret: process.env.IAMPORT_API_SECRET
    });

    const access_token = tokenRes.data.response.access_token;

    // 2. imp_uid를 통해 인증 정보 조회
    const verifyRes = await axios.get(`https://api.iamport.kr/certifications/${imp_uid}`, {
      headers: { Authorization: access_token }
    });

    const cert = verifyRes.data.response;

    // 3. 인증 성공 여부 확인
    if (cert.certified) {
      console.log("✅ 본인 인증 성공:", cert.name, cert.phone);
      req.session.verified = true; // 인증 완료 처리
      res.status(200).send("verified");
    } else {
      console.log("❌ 인증 실패");
      res.status(400).send("인증 실패");
    }

  } catch (error) {
    console.error("❌ 아임포트 인증 오류:", error.message || error.response?.data);
    res.status(500).send("서버 오류");
  }
});

// 아이디/비밀번호 찾기 페이지
router.get('/find', (req, res) => {
  res.render('findAccount');
});

router.post('/find', async (req, res) => {
  const { email } = req.body;
  // 나중에 아이디/비밀번호 찾기 기능 구현 예정
  res.send(`<p>${email} 으로 아이디/비밀번호 찾기 처리가 진행됩니다. (기능 구현 중)</p><a href="/users/login">로그인으로 돌아가기</a>`);
});

module.exports = router;
