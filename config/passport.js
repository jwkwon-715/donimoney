const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Users } = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // 기본은 username이지만, 우리는 email을 사용
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({ where: { email } });
          if (!user) {
            return done(null, false, { message: '존재하지 않는 이메일입니다.' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user); // 로그인 성공
          } else {
            return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
