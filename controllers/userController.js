const bcrypt = require('bcrypt');
const passport = require('passport');
const crypto = require('crypto');
const axios = require('axios');
const { Users, Token } = require('../models');
const sendEmail = require('../public/javascripts/sendEmail');

exports.signup = async (req, res) => {
  const { user_id, password, password2, phone, email, birthdate } = req.body;

  if (password !== password2) {
    req.flash('error', '❌ 비밀번호가 일치하지 않습니다.');
    return res.redirect('/users/signup');
  }

  // 생년월일 필수 체크
  if (!birthdate) {
    req.flash('error', '생년월일을 입력해 주세요.');
    return res.redirect('/users/signup');
  }

  // 만 14세 미만 체크
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  if (age < 14) {
    req.flash('error', '📌 만 14세 미만은 부모님 인증이 필요합니다.');
    return res.redirect('/users/signup');
  }

  try {
    const existingId = await Users.findOne({ where: { user_id } });
    if (existingId) {
      req.flash('error', '❌ 이미 존재하는 사용자 ID입니다.');
      return res.redirect('/users/signup');
    }

    const existingPhone = await Users.findOne({ where: { phone } });
    if (existingPhone) {
      req.flash('error', '❌ 이미 등록된 전화번호입니다.');
      return res.redirect('/users/signup');
    }

    if (email) {
      const existingEmail = await Users.findOne({ where: { email } });
      if (existingEmail) {
        req.flash('error', '❌ 이미 등록된 이메일입니다.');
        return res.redirect('/users/signup');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      user_id,
      password: hashedPassword,
      phone,
      email,
      birthdate,
    });

    req.flash('success', '🎉 회원가입이 완료되었습니다!');
    res.redirect('/users/login');

  } catch (error) {
    console.error(error);
    req.flash('error', '회원가입 중 오류가 발생했습니다.');
    res.redirect('/users/signup');
  }
};


// 로그인 처리
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/users/login');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
};

// 로그아웃 처리
exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

// 아이디/비밀번호 찾기 페이지 렌더
exports.getFindPage = (req, res) => {
  res.render('findAccount', {
    error: req.flash('error'),
    success: req.flash('success'),
    mode: req.query.mode || 'password'
  });
};

// 아이디 찾기 처리
exports.findId = async (req, res) => {
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
};

// 비밀번호 재설정 요청
exports.findPw = async (req, res) => {
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
};

// 비밀번호 재설정 페이지 렌더
exports.getResetPassword = async (req, res) => {
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
};

// 비밀번호 재설정 처리
exports.resetPassword = async (req, res) => {
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
};

// 토큰 만료 확인 (1시간)
function isExpired(createdAt) {
  return Date.now() - new Date(createdAt).getTime() > 3600000;
}
