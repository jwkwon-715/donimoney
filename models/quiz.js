module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define("Quiz", {
      quiz_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        comment: "퀴즈 ID",
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "퀴즈 제목",
      },
      answer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "퀴즈 답",
      },
      solution: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "해설",
      },
      curriculum_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'curriculum', 
            key: 'curriculum_id',
        },
        comment: "커리큘럼id(외래키)",
      },
    }, {
      tableName: "quiz",
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: false, 
    });
  
    return Quiz;
  };
  