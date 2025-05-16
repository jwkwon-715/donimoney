module.exports = (sequelize, DataTypes) => {
  const LearningProgress = sequelize.define("LearningProgress", {
    learning_progress_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "학습 진행 ID",
    },
    learning_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "러닝 ID",
      references: {
        model: "learning",
        key: "learning_id",
      },
    },
    user_character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "유저 캐릭터 ID",
      references: {
        model: "user_characters",
        key: "user_character_id",
      },
    },
    learning_pass: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "학습 통과 여부",
    },
  }, {
    tableName: "learning_progress",
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
    timestamps: false,
  });

  return LearningProgress;
};
