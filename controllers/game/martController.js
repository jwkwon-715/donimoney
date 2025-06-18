const db = require("../../models/index"),
    Inventory = db.Inventory,
    UserCharacters = db.UserCharacters,
    Items = db.Items,
    { sequelize } = db;

module.exports = {
    buy: async (req, res, next) => {
        // 세션에서 캐릭터 ID 가져오기
        const userCharacterId = req.user.user_character_id;

        // 사용자가 구매 시도한 아이템과 수량 정보(int형으로 전환)
        const buyItems = req.body.buyItems.map(item => ({
            itemId: parseInt(item.itemId, 10),
            quantity: parseInt(item.quantity, 10)
        }));
        const clientTotalCost = parseInt(req.body.totalCost, 10);

        console.log("전달된 구매 정보:", buyItems);
        console.log("총 금액:", clientTotalCost);

        const t = await sequelize.transaction(); // 구매 처리 과정 중 트랜잭션

        try {
            const userCharacter = await UserCharacters.findOne({
                where: { user_character_id: userCharacterId },
                transaction: t
            });

            // 가격 검사
            const itemId = buyItems.map(item => item.itemId);
            const itemsInDB = await Items.findAll({
                where: { item_id: itemId },
                transaction: t
            });

            let serverTotalCost = 0;
            for (const buyItem of buyItems) {
                const itemInfo = itemsInDB.find(dbItem => dbItem.item_id === buyItem.itemId);
                if (!itemInfo) {
                    await t.rollback();
                    return res.status(400).send(`존재하지 않는 아이템`);
                }
                serverTotalCost += itemInfo.item_price * buyItem.quantity;
            }

            console.log("서버 계산 총 금액:", serverTotalCost);

            // 프론트에서 넘어온 값과 맞는지 체크
            if (clientTotalCost !== serverTotalCost) {
                await t.rollback();
                return res.status(400).send("구매 처리에 실패");
            }

            // 머니 부족 체크
            if (!userCharacter || userCharacter.money < clientTotalCost) {
                await t.rollback();
                return res.status(400).send('잔액이 부족합니다.');
            }

            // 사용자 인게임 머니 차감
            await UserCharacters.update(
                { money: userCharacter.money - clientTotalCost },
                {
                    where: { user_character_id: userCharacterId },
                    transaction: t
                }
            );

            // 인벤토리 처리 시작
            for (const buyItem of buyItems) {
                const isExist = await Inventory.findOne({
                    where: {
                        user_character_id: userCharacterId,
                        item_id: buyItem.itemId
                    },
                    transaction: t
                });

                if (isExist) {  // 사용자 인벤토리에 해당 아이템이 이미 존재하는 경우
                    await Inventory.update(
                        { quantity: buyItem.quantity + isExist.quantity },
                        {
                            where: {
                                user_character_id: userCharacterId,
                                item_id: buyItem.itemId
                            },
                            transaction: t
                        }
                    );
                } else {  // 없는 경우
                    await Inventory.create(
                        {
                            user_character_id: userCharacterId,
                            item_id: buyItem.itemId,
                            quantity: buyItem.quantity
                        },
                        { transaction: t }
                    );
                }
            }

            await t.commit();  // 구매 성공 시 커밋
            res.redirect('/game/main');

        } catch (err) {
            await t.rollback();
            console.log("마트 구매 처리 오류: ", err);
            next(err);
        }
    }
}
