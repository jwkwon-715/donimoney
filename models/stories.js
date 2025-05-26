
module.exports = (sequelize, DataTypes) => {
  const Stories = sequelize.define("Stories", {
    story_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "스토리 ID",
    },
    story_title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "스토리 제목",
    },
    simple_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "간단한 설명",
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
  }, {
    tableName: "stories",
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
    timestamps: false,
  });

  return Stories;
};