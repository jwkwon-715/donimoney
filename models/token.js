module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Token", {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "users.user_id 참조"
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "tokens",
    timestamps: false
  });
};
