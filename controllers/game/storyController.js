const db = require("../../models/index"),
    Curriculum = db.Curriculum,
    LearningProgress = db.LearningProgress,
    StoryProgress = db.StoryProgress,
    UserCharacters = db.UserCharacters,
    Stories = db.Stories,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;


module.exports = {
    // 볼 수 있는 스토리 리스트 보여주기
    showPossibleStoryList: async (req, res, next) => {
        try {
            const userCharacterId = req.user.user_character_id;

            // 학습
            const latestLearningProgress = await LearningProgress.findOne({
                where: {
                    user_character_id: userCharacterId,
                    learning_pass: true
                },
                order: [["learning_id", "DESC"]],
                attributes: ["learning_id"]
            });
            const learningProg = latestLearningProgress ? latestLearningProgress.learning_id : 0;

            res.locals.learningProg = learningProg;

            const curriculumList = await Curriculum.findAll();
            res.locals.curriculumList = curriculumList;

            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

}