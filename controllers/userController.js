// controllers/userController.js
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Users } = require('../models');

// 회원가입 처리_

exports.signup = async (req, res) => {
  const { user_id, password, password2, phone, email, birthdate } = req.body;

  // 1. 비밀번호 일치 확인
  if (password !== password2) {
    return res.send('❌ 비밀번호가 일치하지 않습니다.');
  }

  try {
    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

    // 3. 사용자 생성
    await Users.create({
      user_id,
      password: hashedPassword,
      phone,
      email,
      birthdate,
    });

    // 4. 회원가입 후 로그인 페이지로 이동
      res.redirect('/users/login?success=1')


  } catch (error) {
    console.error(error);
    res.send('회원가입 중 오류가 발생했습니다.');
  }
};


// 로그인 처리
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info.message); // 로그인 실패 메시지

    req.logIn(user, (err) => {
      if (err) return next(err);
      
      // 로그인 성공 후 프로필 페이지로 리디렉션
      return res.redirect('/');  // 로그인 후 메인화면으로
    });
  })(req, res, next);
};
