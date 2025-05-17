const db = require("../../models/index"),
    Item = db.Items,
    Inventory = db.Inventory;

const userCharacterId = 1; //세션(임시)

module.exports = {
    //crud
    renderMart: async (req, res, next) => {
        try{
            let items = await Item.findAll();
            res.locals.items = items;
            res.render("game/martItemList");
        }catch(err){
            console.log(`error fetching items: ${err}`);
            next(err);
        }
    },

    renderInventory: async (req, res, next) => {
        let characterId = req.params.character_id;
        try{
            let userInventory = await Inventory.findAll({
                where: { character_id: characterId }
            });
            res.locals.userInventory = userInventory;
            next();
        }catch(err){
            console.log(`error fetching inventory: ${err}`);
            next(err);
        }
    },

    //render
    renderMain: (req, res) => {
        res.render("game/main");
    },
    renderHome: (req, res) => {
        res.render("game/home");
    },
    // renderMart: (req, res) => {
    //     res.render("game/mart");
    // },
    renderSchool: (req, res) => {
        res.render("game/school");
    }
};