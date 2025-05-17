const { where } = require("sequelize");

const db = require("../../models/index"),
    LearningProgress = db.LearningProgress,
    Learning = db.Learning,
    UserCharacters = db.UserCharacters,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

const learningReward = 500;

const userCharacterId = 1; //세션(임시)

async function isNewProg(curriculumId) {
    try {
        const LearningProg = await LearningProgress.findOne({
            where: { curriculum_id: curriculumId }
        });
        return !LearningProg;  // 없는 경우 true, 있는 경우 false
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    updateLearningProgress: async (req, res, next) => {
        const learningId = req.body.learningId;
        //const complete = req.body.complete;
        try{
            if(isNewProg){
                await LearningProgress.create({
                    learning_id: learningId,
                    learning_pass: true,
                    user_character_id: userCharacterId
                })
            }else{
                await LearningProgress.update(
                    {learning_pass: true},
                    {
                        where: {
                            learning_id: learningId,
                            user_character_id: userCharacterId
                        }
                    }
                );
            }

            //보상 지급
            await UserCharacters.update(
                { money: money + learningReward },
                {
                    where: { user_character_id: userCharacterId }
                }
            );

            next();

        }catch(err){
            console.log(err);
        }
    },

    renderLearningList: async (req, res, next) => {
        try{
            const learningList = await Learning.findAll();
            
            res.render("game/learningList", {learningList});

        }catch(err){
            console.log(err);
        }
    },

    renderLearningContent: async (req, res, next) => {
        const learningId = req.params.learningId;
        console.log(`learningId: ${learningId}`);

        try{
            const learningContent = await Learning.findOne({
                where: { learning_id: learningId },
                include: [
                    {
                        model: LearningProgress,
                        where: { user_character_id: userCharacterId },
                        required: false, // 해당 유저 학습 기록 없을 수도 있음
                        attributes: ['learning_pass']
                    }
                ]
            });

            res.render('game/learningContent', {learningContent});

        }catch(err){
            console.log(err);
        }
    }
}
