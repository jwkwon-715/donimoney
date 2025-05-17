module.exports = (sequelize, DataTypes) => {
    const StoryCharacter = sequelize.define("StoryCharacter", {
        character_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            // onDelete: "CASCADE"
        },
        character_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: "story_character",
        charset: "utf8",
        collate: "utf8_general_ci"
    });
    return StoryCharacter;
};