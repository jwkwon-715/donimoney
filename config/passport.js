const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Users, UserCharacters } = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // 이메일로 로그인
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({ where: { email } });
          if (!user) {
            return done(null, false, { message: '존재하지 않는 이메일입니다.' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          }

          // 유저 캐릭터 찾기 (user_id 기준)
          const userCharacter = await UserCharacters.findOne({ where: { user_id: user.user_id } });

          // user 객체에 user_character_id를 추가해서 넘김
          const userWithCharacter = {
            ...user.get({ plain: true }),
            user_character_id: userCharacter ? userCharacter.user_character_id : null
          };

          return done(null, userWithCharacter);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // user_id와 user_character_id를 객체로 세션에 저장
  passport.serializeUser((user, done) => {
    done(null, {
      user_id: user.user_id,
      user_character_id: user.user_character_id || null
    });
  });

  // 세션에서 꺼낼 때 user와 user_character_id를 함께 req.user에 할당
  passport.deserializeUser(async (sessionUser, done) => {
    try {
      const user = await Users.findByPk(sessionUser.user_id);
      if (!user) return done(null, false);

      // req.user에 user_character_id도 함께 넣음
      const userWithCharacter = {
        ...user.get({ plain: true }),
        user_character_id: sessionUser.user_character_id
      };
      done(null, userWithCharacter);
    } catch (err) {
      done(err);
    }
  });
};
