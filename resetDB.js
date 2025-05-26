const { sequelize } = require('./models');

(async () => {
  try {
    console.log('📛 Resetting DB...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0'); // 외래키 무시
    await sequelize.drop(); // 모든 테이블 삭제
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // 외래키 다시 켜기

    await sequelize.sync({ force: true }); // 테이블 재생성

    console.log('✅ Database reset and synced.');
    process.exit();
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
})();
