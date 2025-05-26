// story_progress 테이블 , storyProgress.js
module.exports = (sequelize, DataTypes) => {
    const StoryProgress = sequelize.define("StoryProgress", {
      story_progress_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      story_pass: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      user_character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_characters',     // FK 
          key: 'user_character_id'
        }
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'stories',            //  FK 
          key: 'story_id'
        }
      }
    }, {
      tableName: "story_progress",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci"
    });
  
    return StoryProgress
    };