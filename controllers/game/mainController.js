const db = require("../../models/index"),
    Item = db.Items;

module.exports = {
    // 마트 아이템 목록 렌더링
    renderMart: async (req, res, next) => {
        try {
            let items = await Item.findAll();
            res.locals.items = items;
            res.render("game/martItemList");
        } catch (err) {
            console.log(`error fetching items: ${err}`);
            next(err);
        }
    },

    // 메인/홈/학교 화면 렌더링 (필요시 세션 정보 추가 가능)
    renderMain: (req, res) => {
        res.render("game/main");
    },
    renderHome: (req, res) => {
        res.render("game/home");
    },
    renderSchool: (req, res) => {
        res.render("game/school");
    }
};
