module.exports = (sequelize, DataTypes) => {
    const QuizOption = sequelize.define("QuizOption", {
      quiz_option_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        comment: "퀴즈 선택지 ID",
      },
      quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
            model: 'quiz', 
            key: 'quiz_id',
        },
        comment: "퀴즈 id(외래키)",
      },
      quiz_option_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "퀴즈 선택지 번호",
      },
      quiz_option_content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "퀴즈 선택지의 텍스트",
      },
    }, {
      tableName: "quiz_option",
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false, 
    });
  
    return QuizOption;
  };
  