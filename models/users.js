module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "사용자 ID",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "비밀번호",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "전화번호",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "이메일 주소",
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "생년월일",
      },
    }, {
      tableName: "users",
      timestamps: true, // createdAt, updatedAt 자동 생성
      createdAt: "created_at", // created_at으로 이름 변경
      updatedAt: false // updatedAt 사용 안함
    });
  
    return Users;
  };
  