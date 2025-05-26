
// const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const Choices = sequelize.define("Choices", {
        choice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        scene_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "scenes",
                key: "scene_id",
                onDelete: "CASCADE"
              },
        },
        next_scene_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "choices",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false
    });
    return Choices;
};