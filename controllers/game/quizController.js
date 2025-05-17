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

const userCharacterId = 1; //세션(임시)

const generalQReward = 600;
const randomQReward = 200;
const passScore = 80;

//랜덤 퀴즈: 커리큘럼에서 뽑힌 문제들을 모은 전체 배열을 섞음(커리큘럼 순서대로 보이지 않고 랜덤)
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

async function isNewProg(curriculumId) {
    try {
        const quizProg = await QuizProgress.findOne({
            where: { curriculum_id: curriculumId }
        });
        return !quizProg;  // 없는 경우 true, 있는 경우 false
    } catch (err) {
        console.error(err);
    }
}

//현재 푼 퀴즈의 progress의 상태가 true인지 false인지...
async function progressState(curriculumId) {
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
    showPossibleQuizList: async (req, res, next) => {  //도전 가능한 퀴즈 리스트들 보여주기(일반 랜덤 둘 다에서 사용)        
        try{
            // userCharacter의 진행도
            //스토리
            const latestStoryProgress = await StoryProgress.findOne({
                where:{
                    user_character_id: userCharacterId,
                    story_pass: true
                },
                order: [["story_id", "DESC"]],
                attributes: ["story_id"]
            });
            const storyProg = latestStoryProgress ? latestStoryProgress.story_id : 0;

            //학습 
            const latestLearningProgress = await LearningProgress.findOne({
                where: {
                    user_character_id: userCharacterId,
                    learning_pass: true
                },
                order: [["learning_id", "DESC"]],
                attributes: ["learning_id"]
            });
            const learningProg = latestLearningProgress ? latestLearningProgress.learning_id : 0; //아무 현황도 없을 시 0으로 세팅

            res.locals.storyProg = storyProg;
            res.locals.learningProg = learningProg;

            //사용자의 총 진행률 체크(story, learning)
            let totalProg;
            if(storyProg >= learningProg){
                totalProg = learningProg;
            }else if(storyProg < learningProg){
                totalProg = storyProg;
            }
            res.locals.totalProg = totalProg;

            const curriculumList = await Curriculum.findAll();
            res.locals.curriculumList = curriculumList;

            next();
        }catch(err){
            console.log(err);
            next(err);
        }
        
    },
    
    renderQuizTypeList: (req, res, next) => {
        res.render("game/quizTypeList")
    },
    
    renderQuizList: (req, res, next) => {
        res.render("game/quizSelect");
    },
    renderRandomQuizList: (req, res, next) => {
        res.render("game/randomQuizSelect");
    },

    //각 모드에 맞는 퀴즈 보여주기
    solveQuiz: async (req, res, next) => {
        let quizType = req.body.type;  //general or random
        
        try{
            if(quizType == 'general'){
                const curriculumId = parseInt(req.body.curriculumId);

                const quizzes = await Quiz.findAll({
                    where: {curriculum_id: curriculumId},
                    include: [QuizOption],
                    order: Sequelize.literal('RAND()')  // 랜덤
                });

                res.render("game/solveQuiz", {quizzes})

            }else if(quizType == 'random'){
                let curriculumList = req.body.curriculumList;  //프론트에서 form의 체크박스 활용할 예정
                curriculumList = curriculumList.map(curr => parseInt(curr));

                let quizzes = [];
                for(i = 0; i < curriculumList.length; i++){
                    const result = await Quiz.findAll({
                        where: {curriculum_id: curriculumList[i]},
                        include: [QuizOption],
                        order: sequelize.random(),
                        order: Sequelize.literal('RAND()'),
                        limit: 4
                    });
                    quizzes.push(...result);  //결과 누적
                }
                //커리큘럼 순서도 섞고 최대 10개 선택
                quizzes = shuffleArray(quizzes).slice(0, 10);
                res.render("game/solveQuiz", {quizzes});
            }
        }catch(err){
            console.log(err);
            next(err);
        }
    },

    updateQuizProg: async (req, res, next) => {
        const quizType = req.body.type;
        const score = req.body.score;
        try{
            if(score >= passScore){  //기준 점수 넘은 경우
                if(quizType == "general"){
                    const curriculumId = req.body.curriculumId;
    
                    //최초 성공 시에만 progress 정보 변경
                    if(!progressState(curriculumId)){ 
                        if(isNewProg(curriculumId)){  //처음 풀어보는 퀴즈
                            await QuizProgress.create({
                                user_character_id: userCharacterId,
                                quiz_pass: true,
                                curriculum_id: curriculumId
                            });
                        }else{  //기존에 풀었던 퀴즈
                            await QuizProgress.updateQuizProg(
                                {quiz_pass: true},
                                {
                                    where: {
                                        user_character_id: userCharacterId,
                                        curriculum_id: curriculumId
                                    }
                                }
                            );
                        }
                        //보상 지급
                        await UserCharacters.update(
                            { money: money + generalQReward },
                            {
                                where: { user_character_id: userCharacterId }
                            }
                        );
    
                    }else{
                        //현재로서는 최초 성공만 처리 필요
                    }
                }else if(quizType == "random"){
                    //random은 보상만 지급됨
                    await UserCharacters.update(
                        { money: money + randomQReward },
                        {
                            where: { user_character_id: userCharacterId }
                        }
                    );
                }
            }
            next();
        }catch(err){
            next(err);
        }
    }
}