const db = require("../../models/index"),
    LearningProgress = db.LearningProgress,
    Learning = db.Learning,
    UserCharacters = db.UserCharacters,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

const learningReward = 500;

// userCharacterId 매개변수로 받도록 수정
async function isNewProg(learningId, userCharacterId) { 
    try {
        const LearningProg = await LearningProgress.findOne({
            where: { learning_id: learningId, user_character_id: userCharacterId }
        });
        return !LearningProg;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    updateLearningProgress: async (req, res, next) => {
        const learningId = req.body.learningId;
        const userCharacterId = req.user.user_character_id; 

        try {
            const isNew = await isNewProg(learningId, userCharacterId); 
            if (isNew) {
                await LearningProgress.create({
                    learning_id: learningId,
                    learning_pass: true,
                    user_character_id: userCharacterId 
                });
            } else {
                const prog = await LearningProgress.findOne({
                    where: {
                        learning_id: learningId,
                        user_character_id: userCharacterId 
                    }
                });
                if (prog.learning_pass) {
                    return res.status(200).json({ result: 'already_passed' });
                }
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

            res.status(200).json({ result: 'success' });

        } catch (err) {
            console.log(err);
            res.status(500).json({ result: 'fail' });
        }
    },

    renderLearningList: async (req, res, next) => {
    try {
        const learningList = await Learning.findAll();
        res.render("game/learningList", { learningList });
    } catch (err) {
        console.log(err);
        res.status(500).send('서버 오류');
    }
},

    renderLearningContent: async (req, res, next) => {
        const learningId = req.params.learningId;
        const userCharacterId = req.user.user_character_id;

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

            const contentArr = learningContent.content.split(/\n\n/);
            let learningPass = false;
            
            if (learningContent.LearningProgresses?.length > 0) {
                learningPass = !!learningContent.LearningProgresses[0].learning_pass;
            }

            res.render('game/learningContent', {
                learningContent,
                contentArr,
                learningPass
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
};
