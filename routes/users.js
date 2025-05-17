const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { Users, Token } = require('../models');
const userController = require('../controllers/userController');
const sendEmail = require('../public/javascripts/sendEmail');

// ✅ 회원가입 페이지
router.get('/signup', (req, res) => {
  res.render('signup', {
    error: req.flash('error'),
    success: req.flash('success'),
    note: req.flash('note')
    // verified: req.session.verified || false // 인증 관련 제거
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

// ✅ 아임포트 인증 라우트 주석처리
/*
router.post('/verify', async (req, res) => {
  const { imp_uid } = req.body;
  try {
    const tokenRes = await axios.post("https://api.iamport.kr/users/getToken", {
      imp_key: process.env.IAMPORT_API_KEY,
      imp_secret: process.env.IAMPORT_API_SECRET
    });

    const access_token = tokenRes.data.response.access_token;
    const verifyRes = await axios.get(`https://api.iamport.kr/certifications/${imp_uid}`, {
      headers: { Authorization: access_token }
    });

    const cert = verifyRes.data.response;
    if (cert.certified) {
      console.log("✅ 본인 인증 성공:", cert.name, cert.phone);
      req.session.verified = true;
      res.status(200).send("verified");
    } else {
      res.status(400).send("인증 실패");
    }
  } catch (error) {
    console.error("❌ 아임포트 오류:", error.message || error.response?.data);
    res.status(500).send("서버 오류");
  }
});
*/

// 🔍 아이디/비밀번호 찾기 페이지
router.get('/find', (req, res) => {
  res.render('findAccount', {
    error: req.flash('error'),
    success: req.flash('success'),
    mode: req.query.mode || 'password'
  });
});

// 🔎 아이디 찾기 처리
router.post('/find-id', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      req.flash('error', '❌ 등록된 이메일이 없습니다');
      return res.redirect('/users/find?mode=id');
    }
    await sendEmail(email, '🔎 아이디 찾기 결과', 
      `<p>회원님의 아이디는 <strong>${user.user_id}</strong> 입니다</p>`
    );
    req.flash('success', '✅ 아이디가 이메일로 발송되었습니다');
    res.redirect('/users/find?mode=id');
  } catch (error) {
    console.error(error);
    req.flash('error', '서버 오류 발생');
    res.redirect('/users/find?mode=id');
  }
});

// 🔒 비밀번호 재설정 요청
router.post('/find-pw', async (req, res) => {
  const { user_id, email } = req.body;
  try {
    const user = await Users.findOne({ where: { user_id, email } });
    if (!user) {
      req.flash('error', '❌ 일치하는 회원 정보가 없습니다');
      return res.redirect('/users/find?mode=password');
    }

    await Token.destroy({ where: { user_id } });
    const token = crypto.randomBytes(32).toString('hex');
    await Token.create({ user_id, token });

    const resetLink = `${process.env.BASE_URL}/users/reset-password/${user_id}/${token}`;
    await sendEmail(email, '🔑 비밀번호 재설정 안내', 
      `<p>아래 링크를 클릭해 주세요 (1시간 유효):</p>
       <a href="${resetLink}">비밀번호 재설정하기</a>`
    );

    req.flash('success', '✅ 재설정 링크가 발송되었습니다');
    res.redirect('/users/find?mode=password');
  } catch (error) {
    console.error(error);
    req.flash('error', '서버 오류 발생');
    res.redirect('/users/find?mode=password');
  }
});

// 🔄 비밀번호 재설정 페이지
router.get('/reset-password/:user_id/:token', async (req, res) => {
  const { user_id, token } = req.params;
  try {
    const tokenData = await Token.findOne({ 
      where: { user_id, token },
      include: [{ model: Users }]
    });

    if (!tokenData || isExpired(tokenData.created_at)) {
      req.flash('error', '⚠️ 유효하지 않은 링크입니다');
      return res.redirect('/users/find?mode=password');
    }

    res.render('resetPassword', { 
      user_id, 
      token,
      error: req.flash('error') 
    });
  } catch (error) {
    console.error(error);
    req.flash('error', '서버 오류 발생');
    res.redirect('/users/find?mode=password');
  }
});

// 🔄 비밀번호 변경 처리
router.post('/reset-password/:user_id/:token', async (req, res) => {
  const { user_id, token } = req.params;
  const { password } = req.body;
  try {
    const tokenData = await Token.findOne({ where: { user_id, token } });
    if (!tokenData || isExpired(tokenData.created_at)) {
      req.flash('error', '⚠️ 유효하지 않은 요청입니다');
      return res.redirect('/users/find?mode=password');
    }

    const hashed = await bcrypt.hash(password, 10);
    await Users.update({ password: hashed }, { where: { user_id } });
    await Token.destroy({ where: { user_id } });

    req.flash('success', '🎉 비밀번호 변경 성공! 로그인 해주세요');
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    req.flash('error', '서버 오류 발생');
    res.redirect('/users/find?mode=password');
  }
});

// ⏳ 토큰 만료 확인 (1시간)
function isExpired(createdAt) {
  return Date.now() - new Date(createdAt).getTime() > 3600000;
}

module.exports = router;
