const db = require("../../models/index"),
    Curriculum = db.Curriculum,
    LearningProgress = db.LearningProgress,
    StoryProgress = db.StoryProgress,
    UserCharacters = db.UserCharacters,
    Stories = db.Stories,
    sequelize = db.sequelize,
    Inventory = db.Inventory,
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

            const storyList = await Stories.findAll({ 
                attributes: ['story_id', 'story_title', 'simple_description']
            });
            res.locals.storyList = storyList;

            next();

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    isUnlock: async (req, res, next) => {
        try {
            const userCharacterId = req.user.user_character_id;
            //const unlockItem = req.body.unlockItem;
            const unlockItem = 5;  //임시 하드코딩: 실제로는 윗 줄 사용

            const checkUserInventory = await Inventory.findOne({
                where: {
                    user_character_id: userCharacterId,
                    item_id: unlockItem
                }
            })

            if(checkUserInventory){
                res.locals.isUnlock = true;
            }else{
                res.locals.isUnlock = false;
            }

            next();

        }catch(err){
            console.log(err);
            next(err);
        }
    },

    renderStoriesList: async (req, res, next) => {
        res.render("game/storyList", {
            storyList: res.locals.storyList,
            learningProg: res.locals.learningProg,
            isUnlock: res.locals.isUnlock
        });
    }

}