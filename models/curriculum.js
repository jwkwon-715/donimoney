// curriculum 테이블, curriculum.js
module.exports = (sequelize, DataTypes) => {
    const Curriculum = sequelize.define("Curriculum", {
      curriculum_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      curriculum_title: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: "curriculum",
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false
    });
  
    return Curriculum;
    };