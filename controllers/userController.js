// controllers/userController.js
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Users } = require('../models');

exports.signup = async (req, res) => {
  const { user_id, password, password2, phone, email, birthdate, verified } = req.body;

  // 비밀번호 일치 확인
  if (password !== password2) {
    req.flash('error', '❌ 비밀번호가 일치하지 않습니다.');
    return res.redirect('/users/signup');
  }

  try {
    // 중복 검사
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

    // 나이 계산
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    // 나이에 따라 인증 확인
    if (age < 14 && req.session.verified !== true) {
  req.flash('error', '📌 만 14세 미만은 보호자 인증이 필요합니다.');
  return res.redirect('/users/signup');
} else if (age >= 14 && req.session.verified !== true) {
  req.flash('error', '📌 본인 인증이 필요합니다.');
  return res.redirect('/users/signup');
}

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    await Users.create({
      user_id,
      password: hashedPassword,
      phone,
      email,
      birthdate,
    });

    req.flash('success', '🎉 회원가입이 완료되었습니다!');
    req.session.verified = false;
    res.redirect('/users/login');

  } catch (error) {
    console.error(error);
    req.flash('error', '회원가입 중 오류가 발생했습니다.');
    res.redirect('/users/signup');
  }
};


// 로그인 함수 그대로 유지
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
