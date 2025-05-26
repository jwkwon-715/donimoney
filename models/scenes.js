
// scenes 테이블, scenes.js
module.exports = (sequelize, DataTypes) =>{
    const Scenes = sequelize.define("Scenes", {
      scene_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      background: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'stories',         // FK 
          key: 'story_id'
        }
      }
    }, {
      tableName: "scenes",
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false
    });
  
    return Scenes
    };  