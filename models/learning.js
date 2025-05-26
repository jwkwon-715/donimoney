
module.exports = (sequelize, DataTypes) => {
  const Learning = sequelize.define("Learning", {
    learning_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "러닝 ID",
    },
    curriculum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "커리큘럼 ID",
      references: {
        model: "curriculum",
        key: "curriculum_id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "학습 콘텐츠 내용",
    },
  }, {
    tableName: "learning",
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
    timestamps: false,
  });

  return Learning;
};
