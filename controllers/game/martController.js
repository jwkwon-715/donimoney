const db = require("../../models/index"),
    Inventory = db.Inventory,
    UserCharacters = db.UserCharacters,
    { sequelize } = db;

const userCharacterId = 1; //세션(임시로 하드코딩)

module.exports = {
    buy: async (req, res, next) => {
        // 사용자가 구매 시도한 아이템과 수량 정보(int형으로 전환)
        const buyItems = req.body.buyItems.map(item => ({
            itemId: parseInt(item.itemId, 10),
            quantity: parseInt(item.quantity, 10)
        }));
        const totalCost = parseInt(req.body.totalCost, 10);

        console.log("전달된 구매 정보:", buyItems);
        console.log("총 금액:", totalCost);

        const t = await sequelize.transaction(); // 구매 처리 과정 중 트랜잭션

        try {
            const userCharacter = await UserCharacters.findOne({
                where: { user_character_id: userCharacterId },
                transaction: t
            });

            // 사용자 인게임 머니 차감
            await UserCharacters.update(
                { money: userCharacter.money - totalCost },
                {
                    where: { user_character_id: userCharacterId },
                    transaction: t
                }
            );

            // 인벤토리 처리 시작
            for (const buyItem of buyItems) {
                const isExist = await Inventory.findOne({
                    where: {
                        user_character_id: userCharacter.user_character_id,
                        item_id: buyItem.itemId
                    },
                    transaction: t
                });

                if (isExist) {  // 사용자 인벤토리에 해당 아이템이 이미 존재하는 경우
                    await Inventory.update(
                        { quantity: buyItem.quantity + isExist.quantity },
                        {
                            where: {
                                user_character_id: userCharacter.user_character_id,
                                item_id: buyItem.itemId
                            },
                            transaction: t
                        }
                    );
                } else {  // 없는 경우
                    await Inventory.create(
                        {
                            user_character_id: userCharacter.user_character_id,
                            item_id: buyItem.itemId,
                            quantity: buyItem.quantity
                        },
                        { transaction: t }
                    );
                }
            }

            await t.commit();  // 구매 성공 시 커밋
            res.render("game/main");

        } catch (err) {
            await t.rollback();
            console.log("마트 구매 처리 오류: ", err);
            next(err);
        }
    }
}
