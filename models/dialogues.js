module.exports = (sequelize, DataTypes) => {
    const Dialogues = sequelize.define("Dialogues", {
        dialogue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        dialogue: {
            type: DataTypes.JSON,
            allowNull: false
        },
        scene_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "scenes",
                key: "scene_id",
                onDelete: "CASCADE"
              },
        }
    }, {
        tableName: "dialogues",
        charset: "utf8",
        collate: "utf8_general_ci"
    });
    return Dialogues;
};