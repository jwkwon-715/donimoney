
module.exports = (sequelize, DataTypes) => {
    const QuizProgress = sequelize.define("QuizProgress", {
      quiz_progress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        comment: "퀴즈 진행률 ID",
      },
      quiz_pass: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "퀴즈 패스 여부",
      },
      user_character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_characters', 
            key: 'user_character_id',
        },
        comment: "유저가 생성한 캐릭터의 id",
      },
      curriculum_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'curriculum', 
            key: 'curriculum_id',
        },
        comment: "커리큘럼 id",
      },
    }, {
      tableName: "quiz_progress",
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false, 
    });
  
    return QuizProgress;
  };
  