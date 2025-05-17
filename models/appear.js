module.exports = (sequelize, DataTypes) => {
  const Appear = sequelize.define("Appear", {
    scene_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "장면 ID",
      references: {
        model: "scenes",
        key: "scene_id",
      },
      onDelete: "CASCADE",
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "캐릭터 ID",
      references: {
        model: "story_character",
        key: "character_id",
      },
      onDelete: "CASCADE",
    },
    character_face: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "등장 캐릭터의 표정",
    },
    x_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "화면 상 X 좌표",
    },
    y_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "화면 상 Y 좌표",
    }
  }, {
    tableName: "appear",
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: false,
  });

  return Appear;
};