module.exports = (sequelize, DataTypes) => {
  const JsonFiles = sequelize.define("JsonFiles", {
    json_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "제이슨 파일 ID",
    },
    json_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "제이슨 파일 이름",
    },
    json_content: {
      type: DataTypes.JSON, 
      allowNull: false,
      comment: "실제 제이슨 데이터",
    },
    story_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "스토리 ID",
      references: {
        model: "stories",
        key: "story_id",
      },
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: "jsonFiles",
    charset: "utf8",
    collate: "utf8_general_ci",
  });

  return JsonFiles;
};
