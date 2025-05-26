module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define('Items', {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    item_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    item_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    item_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      type: DataTypes.ENUM('잡화', '가구', '옷'),
    },
  }, {
    tableName: 'items',
    timestamps: false,
  });

  return Items;
};
