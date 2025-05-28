const db = require("../../models/index"),
    Item = db.Items,
    Inventory = db.Inventory;

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

    // 내 인벤토리 렌더링 (세션의 user_character_id 사용)
    renderInventory: async (req, res, next) => {
        // 세션에서 캐릭터 ID 가져오기
        const userCharacterId = req.user.user_character_id;
        try {
            let userInventory = await Inventory.findAll({
                where: { character_id: userCharacterId }
            });
            res.locals.userInventory = userInventory;
            next();
        } catch (err) {
            console.log(`error fetching inventory: ${err}`);
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
