const db = require("../../models/index"),
    Inventory = db.Inventory,
    UserCharacters = db.UserCharacters,
    Items = db.Items,
    { sequelize } = db;

module.exports = {
    buy: async (req, res) => {
        try {
        const userCharacterId = 1;
          const { itemId, quantity, totalCost } = req.body;
      
          if (!itemId || !quantity || !totalCost) {
            return res.status(400).json({ message: "Invalid request body" });
          }
      
          const isExist = await Inventory.findOne({
            where: { user_character_id: userCharacterId, item_id: itemId }
          });
          
          if (isExist) {
            await Inventory.update(
              { quantity: isExist.quantity + quantity },
              { where: { user_character_id: userCharacterId, item_id: itemId } }
            );
          } else {
            await Inventory.create({
              user_character_id: userCharacterId,
              item_id: itemId,
              quantity: quantity
            });
          }
          
          res.status(200).json({ message: "Item purchased successfully" });
        } catch (error) {
          console.error("Purchase failed:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
      
    buyNew: async (req, res, next) => {
        console.log("req.body:", req.body);
        // 테스트용 유저 ID (DB에 존재하는 실제 user_character_id)
        //const userCharacterId = 1;

        // const buyItems = req.body.buyItems.map(item => ({
        //     itemId: parseInt(item.itemId, 10),
        //     quantity: parseInt(item.quantity, 10)
        // }));
        // const clientTotalCost = parseInt(req.body.totalCost, 10);

        // const t = await sequelize.transaction();

        try {
                const userCharacterId = 1;

            // buyItems 배열 받기 (itemId, quantity)
            const buyItems = req.body.buyItems.map(item => ({
                itemId: parseInt(item.itemId, 10),
                quantity: parseInt(item.quantity, 10)
            }));

            for (const buyItem of buyItems) {
                const isExist = await Inventory.findOne({
                    where: {
                        user_character_id: userCharacterId,
                        item_id: buyItem.itemId
                    }
                });

                if (isExist) {
                    await Inventory.update(
                        { quantity: isExist.quantity + buyItem.quantity },
                        {
                            where: {
                                user_character_id: userCharacterId,
                                item_id: buyItem.itemId
                            }
                        }
                    );
                } else {
                    await Inventory.create({
                        user_character_id: userCharacterId,
                        item_id: buyItem.itemId,
                        quantity: buyItem.quantity
                    });
                }
            }

            return res.status(200).json({ message: "구매 성공(단순 처리)" });

        } catch (err) {
            console.error("마트 구매 처리 오류: ", err);
            return res.status(500).json({ message: "서버 오류" });
        }
    },
    // buyNewOptimized: async (req, res) => {
    //     const userCharacterId = 1;
    //     const buyItems = req.body.buyItems.map(item => ({
    //       itemId: parseInt(item.itemId, 10),
    //       quantity: parseInt(item.quantity, 10)
    //     }));
      
    //     const t = await sequelize.transaction();
      
    //     try {
    //       // 1. 구매할 itemId 목록 추출
    //       const itemIds = buyItems.map(item => item.itemId);
      
    //       // 2. 기존 인벤토리 항목 미리 모두 가져오기 (1회 SELECT)
    //       const existingItems = await Inventory.findAll({
    //         where: {
    //           user_character_id: userCharacterId,
    //           item_id: itemIds
    //         },
    //         transaction: t
    //       });
      
    //       // 3. 기존 항목을 Map으로 정리
    //       const existingMap = new Map();
    //       existingItems.forEach(item => {
    //         existingMap.set(item.item_id, item);
    //       });
      
    //       // 4. 업데이트 대상과 삽입 대상 분리
    //       const updatePromises = [];
    //       const insertItems = [];
      
    //       for (const item of buyItems) {
    //         const exist = existingMap.get(item.itemId);
    //         if (exist) {
    //           updatePromises.push(
    //             Inventory.update(
    //               { quantity: exist.quantity + item.quantity },
    //               {
    //                 where: {
    //                   user_character_id: userCharacterId,
    //                   item_id: item.itemId
    //                 },
    //                 transaction: t
    //               }
    //             )
    //           );
    //         } else {
    //           insertItems.push({
    //             user_character_id: userCharacterId,
    //             item_id: item.itemId,
    //             quantity: item.quantity
    //           });
    //         }
    //       }
      
    //       // 5. 병렬 UPDATE 수행
    //       await Promise.all(updatePromises);
      
    //       // 6. Bulk INSERT (신규 아이템들)
    //       if (insertItems.length > 0) {
    //         await Inventory.bulkCreate(insertItems, { transaction: t });
    //       }
      
    //       // 7. 커밋 및 응답
    //       await t.commit();
    //       return res.status(200).json({ message: "구매 성공(최적화)" });
      
    //     } catch (err) {
    //       await t.rollback();
    //       console.error("최적화 구매 처리 오류:", err);
    //       return res.status(500).json({ message: "서버 오류" });
    //     }
    //   }
      
}
