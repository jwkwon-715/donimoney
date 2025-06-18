module.exports = (sequelize, DataTypes) => {
    const UserCharacters = sequelize.define("UserCharacters", {
      user_character_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "토룡이"
      },
      money: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },{
        tableName: 'user_characters',
        timestamps: false
    });
  
    return UserCharacters;
  };
  