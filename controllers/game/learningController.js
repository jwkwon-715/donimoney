const db = require("../../models/index"),
    LearningProgress = db.LearningProgress,
    Learning = db.Learning,
    UserCharacters = db.UserCharacters,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

const learningReward = 500;
const userCharacterId = 7; // 세션(임시)

async function isNewProg(learningId) {
    try {
        const LearningProg = await LearningProgress.findOne({
            where: { learning_id: learningId, user_character_id: userCharacterId }
        });
        return !LearningProg;  // 없는 경우 true, 있는 경우 false
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    updateLearningProgress: async (req, res, next) => {
        const learningId = req.body.learningId;
        try {
            const isNew = await isNewProg(learningId);
            if (isNew) {
                await LearningProgress.create({
                    learning_id: learningId,
                    learning_pass: true,
                    user_character_id: userCharacterId
                });
            } else {
                await LearningProgress.update(
                    { learning_pass: true },
                    {
                        where: {
                            learning_id: learningId,
                            user_character_id: userCharacterId
                        }
                    }
                );
            }

            // 보상 지급
            const user = await UserCharacters.findOne({
                where: { user_character_id: userCharacterId },
                attributes: ['money']
            });
            const currentMoney = user ? user.money : 0;

            await UserCharacters.update(
                { money: currentMoney + learningReward },
                {
                    where: { user_character_id: userCharacterId }
                }
            );

            next();

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    renderLearningList: async (req, res, next) => {
        try {
            const learningList = await Learning.findAll();
            res.render("game/learningList", { learningList });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    renderLearningContent: async (req, res, next) => {
        const learningId = req.params.learningId;
        try {
            const learningContent = await Learning.findOne({
                where: { learning_id: learningId },
                include: [
                    {
                        model: LearningProgress,
                        where: { user_character_id: userCharacterId },
                        required: false,
                        attributes: ['learning_pass']
                    }
                ]
            });

            // 카드 분리: \n\n로 나눔
            const contentArr = learningContent.content.split(/\n\n/);

            res.render('game/learningContent', {
                learningContent,
                contentArr
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
};
