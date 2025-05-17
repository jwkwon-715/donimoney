'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

config.define = {
  freezeTableName: true,
  charset: 'utf8',
  collate: 'utf8_general_ci',
  timestamps: false
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 모델 자동으로 등록
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 관계 명시 (명시적 관계 설정이 필요한 경우)
db.Users.hasMany(db.UserCharacters, { foreignKey: 'user_id' });
db.UserCharacters.belongsTo(db.Users, { foreignKey: 'user_id' });

db.UserCharacters.hasMany(db.Inventory, { foreignKey: 'user_character_id' });
db.Inventory.belongsTo(db.UserCharacters, { foreignKey: 'user_character_id', onDelete: 'CASCADE' });

db.Items.hasMany(db.Inventory, { foreignKey: 'item_id' });
db.Inventory.belongsTo(db.Items, { foreignKey: 'item_id', onDelete: 'CASCADE' });

db.Curriculum.hasMany(db.Quiz, {
  foreignKey: 'curriculum_id'
});
db.Quiz.belongsTo(db.Curriculum, {
  foreignKey: 'curriculum_id'
});

db.Quiz.hasMany(db.QuizOption, {
  foreignKey: 'quiz_id',
  onDelete: 'CASCADE'
});
db.QuizOption.belongsTo(db.Quiz, {
  foreignKey: 'quiz_id',
  onDelete: 'CASCADE'
});

db.UserCharacters.hasMany(db.QuizProgress, {
  foreignKey: 'user_character_id'
});
db.QuizProgress.belongsTo(db.UserCharacters, {
  foreignKey: 'user_character_id'
});

db.Curriculum.hasMany(db.QuizProgress, {
  foreignKey: 'curriculum_id'
});
db.QuizProgress.belongsTo(db.Curriculum, {
  foreignKey: 'curriculum_id'
});

db.Learning.belongsTo(db.Curriculum, {
  foreignKey: "curriculum_id",
});
db.Stories.belongsTo(db.Curriculum, {
  foreignKey: "curriculum_id",
});

db.Learning.hasMany(db.LearningProgress, {
  foreignKey: "learning_id",
});
db.LearningProgress.belongsTo(db.Learning, {
  foreignKey: "learning_id",
});

db.UserCharacters.hasMany(db.LearningProgress, {
  foreignKey: "user_character_id",
});
db.LearningProgress.belongsTo(db.UserCharacters, {
  foreignKey: "user_character_id",
});

db.Stories.hasMany(db.StoryProgress, {
  foreignKey: "story_id",
});
db.Stories.hasMany(db.Scenes, {
  foreignKey: "story_id",
});
db.Scenes.belongsTo(db.Stories, {
  foreignKey: "story_id",
});

db.Appear.belongsTo(db.Scenes, {
  foreignKey: "scene_id",
});
db.Appear.belongsTo(db.StoryCharacter, {
  foreignKey: "character_id",
});

db.StoryProgress.belongsTo(db.UserCharacters, {
  foreignKey: 'user_character_id'
});
db.UserCharacters.hasMany(db.StoryProgress, {
  foreignKey: 'user_character_id'
});

db.StoryProgress.belongsTo(db.Stories, {
  foreignKey: 'story_id'
});
db.Stories.hasMany(db.StoryProgress, {
  foreignKey: 'story_id'
});

db.Curriculum.hasOne(db.Learning, {
  foreignKey: 'curriculum_id'
});
db.Curriculum.hasOne(db.Stories, {
  foreignKey: 'curriculum_id'
});

db.Scenes.belongsTo(db.Stories, {
  foreignKey: 'story_id'
});
db.Stories.hasMany(db.Scenes, {
  foreignKey: 'story_id'
});

db.Scenes.hasMany(db.Dialogues, {
  foreignKey: 'scene_id'
});
db.Dialogues.belongsTo(db.Scenes, {
  foreignKey: 'scene_id'
})

db.Scenes.hasMany(db.Choices, {
  foreignKey: 'scene_id'
});
db.Choices.belongsTo(db.Scenes, {
  foreignKey: 'scene_id'
});

db.StoryCharacter.belongsToMany(db.Scenes, {
  through: db.Appear,
  foreignKey: 'character_id',
  otherKey: 'scene_id'
});
db.Scenes.belongsToMany(db.StoryCharacter, {
  through: db.Appear,
  foreignKey: 'scene_id',
  otherKey: 'character_id'
});

// 여기서 Users와 Token의 관계 설정!
db.Users.hasMany(db.Token, { foreignKey: 'user_id', sourceKey: 'user_id' });
db.Token.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;