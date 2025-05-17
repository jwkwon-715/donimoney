module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
      user_character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_characters',
          key: 'user_character_id',
        },
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'item_id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      tableName: 'inventory',
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      indexes: [
        {
          unique: true,
          fields: ['user_character_id', 'item_id'], // 복합 기본 키 설정
        },
      ],
    });
  
    return Inventory;
  };
  