const db = require("../../models/index"),
    Quiz = db.Quiz,
    QuizOption = db.QuizOption,
    Curriculum = db.Curriculum,
    LearningProgress = db.LearningProgress,
    StoryProgress = db.StoryProgress,
    QuizProgress = db.QuizProgress,
    UserCharacters = db.UserCharacters,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

const generalQReward = 600;
const randomQReward = 200;
const passScore = 80;

//랜덤 퀴즈: 커리큘럼에서 뽑힌 문제들을 모은 전체 배열을 섞음
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

async function isNewProg(curriculumId, userCharacterId) {
    try {
        const quizProg = await QuizProgress.findOne({
            where: { user_character_id: userCharacterId, curriculum_id: curriculumId }
        });
        return !quizProg;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function progressState(curriculumId, userCharacterId) {
    const progress = await QuizProgress.findOne({
        where: {
            user_character_id: userCharacterId,
            curriculum_id: curriculumId
        },
        attributes: ['quiz_pass']
    });
    return progress ? progress.quiz_pass : null;
}

module.exports = {
    // 도전 가능한 퀴즈 리스트들 보여주기
    showPossibleQuizList: async (req, res, next) => {
        try {
            const userCharacterId = req.user.user_character_id;

            // 학습
            const learningProgressList = await LearningProgress.findAll({
                where: {
                    user_character_id: userCharacterId,
                    learning_pass: true
                },
                order: [["learning_id", "DESC"]],
                attributes: ["learning_id"]
            });

            res.locals.learningProgressList = learningProgressList;

            const curriculumList = await Curriculum.findAll();
            res.locals.curriculumList = curriculumList;

            next();

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    renderQuizTypeList: (req, res, next) => {
        res.render("game/quizTypeList");
    },

    renderQuizList: (req, res, next) => {
        res.render("game/quizSelect", 
            { 
                learningProgressList: res.locals.learningProgressList, 
                curriculumList: res.locals.curriculumList
            });
    },

    renderRandomQuizList: (req, res, next) => {
        res.render("game/randomQuizSelect", 
            { 
                learningProgressList: res.locals.learningProgressList, 
                curriculumList: res.locals.curriculumList
            });
    },

    renderQuizSuccess: (req, res) => {
        res.render('game/quizSuccess');
    },

    renderQuizFail: (req, res) => {
        res.render('game/quizFail');
    },

    // 각 모드에 맞는 퀴즈 보여주기
    solveQuiz: async (req, res, next) => {
        let quizType = req.body.type;
        try {
            if (quizType == 'general') {
                const curriculumId = parseInt(req.body.curriculumId);

                const quizzes = await Quiz.findAll({
                    where: { curriculum_id: curriculumId },
                    include: [QuizOption],
                    order: Sequelize.literal('RAND()')
                });

                res.render("game/solveQuiz", {
                    quizzes,
                    quizType: 'general',
                    curriculumId
                });

            } else if (quizType == 'random') {
                let curriculumList = req.body.curriculumList;
                curriculumList = curriculumList.map(curr => parseInt(curr));
                let quizzes = [];
                for (let i = 0; i < curriculumList.length; i++) {
                    const result = await Quiz.findAll({
                        where: { curriculum_id: curriculumList[i] },
                        include: [QuizOption],
                        order: Sequelize.literal('RAND()'),
                        limit: 4
                    });
                    quizzes.push(...result);
                }
                quizzes = shuffleArray(quizzes).slice(0, 10);
                res.render("game/solveQuiz", {
                    quizzes,
                    quizType: 'random',
                    curriculumId: null
                });
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    updateQuizProg: async (req, res, next) => {
        const quizType = req.body.type;
        const score = req.body.score;
        const userCharacterId = req.user.user_character_id;

        try {
            if (score >= passScore) {
                if (quizType == "general") {
                    const curriculumId = req.body.curriculumId;

                    const progState = await progressState(curriculumId, userCharacterId);

                    if (!progState) {
                        const isNew = await isNewProg(curriculumId, userCharacterId);

                        if (isNew) {
                            await QuizProgress.create({
                                user_character_id: userCharacterId,
                                quiz_pass: true,
                                curriculum_id: curriculumId
                            });
                        } else {
                            await QuizProgress.update(
                                { quiz_pass: true },
                                {
                                    where: {
                                        user_character_id: userCharacterId,
                                        curriculum_id: curriculumId
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
                } else if (quizType == "random") {
                    // random은 보상만 지급
                    const user = await UserCharacters.findOne({
                        where: { user_character_id: userCharacterId },
                        attributes: ['money']
                    });
                    if (!user) throw new Error('User not found');
                    const currentMoney = user.money;
                    await UserCharacters.update(
                        { money: currentMoney + randomQReward },
                        {
                            where: { user_character_id: userCharacterId }
                        }
                    );
                }
            }
            next();
        } catch (err) {
            console.error('updateQuizProg 에러:', err);
            next(err);
        }
    }
};
