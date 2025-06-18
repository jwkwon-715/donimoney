const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Users, UserCharacters } = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'user_id',
        passwordField: 'password',
      },
      async (user_id, password, done) => {
        try {
          const user = await Users.findOne({ where: { user_id } });
          if (!user) {
            return done(null, false, { message: '존재하지 않는 아이디입니다.' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          }

          // 유저 캐릭터 찾기
          const userCharacter = await UserCharacters.findOne({ where: { user_id: user.user_id } });

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

  passport.serializeUser((user, done) => {
    done(null, {
      user_id: user.user_id,
      user_character_id: user.user_character_id || null
    });
  });

  passport.deserializeUser(async (sessionUser, done) => {
    try {
      const user = await Users.findByPk(sessionUser.user_id);
      if (!user) return done(null, false);

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
