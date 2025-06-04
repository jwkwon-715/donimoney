const db = require("../../models/index"),
    Curriculum = db.Curriculum,
    LearningProgress = db.LearningProgress,
    StoryProgress = db.StoryProgress,
    UserCharacters = db.UserCharacters,
    Stories = db.Stories,
    sequelize = db.sequelize,
    Inventory = db.Inventory,
    QuizProgress = db.QuizProgress,
    Sequelize = db.Sequelize;

//스토리 잠금 해제 조건 아이템 객체
const storyUnlockItems = {
    2: 1 //실제 아이템 아이디로 변경 필요
}

const generalQReward = 800;

async function isNewProg(storyId, userCharacterId) {
    try {
        const storyProg = await StoryProgress.findOne({
            where: { user_character_id: userCharacterId, story_id: storyId }
        });
        return !storyProg;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function progressState(storyId, userCharacterId) {
    const progress = await StoryProgress.findOne({
        where: {
            user_character_id: userCharacterId,
            story_id: storyId
        },
        attributes: ['story_pass']
    });
    return progress ? progress.story_pass : null;
}
    
module.exports = {
    // 볼 수 있는 스토리 리스트 보여주기
    showPossibleStoryList: async (req, res, next) => {
        try {
            const userCharacterId = req.user.user_character_id;

            // 학습 현황
            const learningProgressList = await LearningProgress.findAll({
                where: {
                    user_character_id: userCharacterId,
                    learning_pass: true
                }
            });

            // 퀴즈 현황
            const QuizProgressList = await QuizProgress.findAll({
                where: {
                    user_character_id: userCharacterId,
                    quiz_pass: true
                }
            });

            //학습과 퀴즈 둘 다 pass 했을 경우에 해당 스토리 오픈 가능
            const learnedIds = learningProgressList.map(learning => learning.learning_id);

            const passedBothList = QuizProgressList.filter(quiz => 
                learnedIds.includes(quiz.curriculum_id)
            );

            const storyProg = await StoryProgress.findOne({
                where: {
                  user_character_id: userCharacterId
                },
                order: [['story_id', 'DESC']],
                limit: 1,
                attributes: ['story_id']
              });
              
            res.locals.passedBothList = passedBothList;

            //사용자의 스토리 진행 현황 중 가장 마지막 스토리의 아이디를 보냄
            res.locals.storyProg = storyProg ? storyProg.story_id : 0;

            const storyList = await Stories.findAll({ 
                attributes: ['story_id', 'story_title', 'simple_description', 'curriculum_id']
            });
            res.locals.storyList = storyList;

            next();

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    hasUnlockItem: async (req, res, next) => {
        try {
            const userCharacterId = req.user.user_character_id;
            
            const unlockedStories = [];

            for (const [storyId, itemId] of Object.entries(storyUnlockItems)) {
                const hasItem = await Inventory.findOne({
                    where: {
                    user_character_id: userCharacterId,
                    item_id: itemId
                    }
                });

                if (hasItem) {
                    unlockedStories.push(storyId);
                }
            }

            res.locals.unlockedStories = unlockedStories;

            next();

        }catch(err){
            console.log(err);
            next(err);
        }
    },

    renderStoriesList: async (req, res, next) => {
        res.render("game/storyList", {
            storyList: res.locals.storyList,
            passedBothList: res.locals.passedBothList,
            storyProg: res.locals.storyProg,
            unlockedStories: res.locals.unlockedStories,
            storyUnlockItems: storyUnlockItems
        });
    },

    updateStoryProg: async (req, res, next) => {
        const userCharacterId = req.user.user_character_id;
        const storyId = req.body.storyId;

        try {
            const progState = await progressState(storyId, userCharacterId);

            if (!progState) {
                const isNew = await isNewProg(storyId, userCharacterId);

                if (isNew) {
                    await StoryProgress.create({
                        user_character_id: userCharacterId,
                        story_pass: true,
                        story_id: storyId,
                    });
                } else {
                    await StoryProgress.update(
                        { story_pass: true },
                        {
                            where: {
                                user_character_id: userCharacterId,
                                story_id: storyId
                            }
                        }
                    );
                }
                // 보상 지급
                const user = await UserCharacters.findOne({
                    where: { user_character_id: userCharacterId },
                    attributes: ['money']
                });
                if (!user) throw new Error('User not found');
                const currentMoney = user.money;
                await UserCharacters.update(
                    { money: currentMoney + generalQReward },
                    {
                        where: { user_character_id: userCharacterId }
                    }
                );
                console.log(currentMoney);
            }
        } catch (err) {
            console.error('updateStoryProg 에러:', err);
            next(err);
        }
    },
}