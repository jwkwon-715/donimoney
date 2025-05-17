let buyItems = [];

function increaseQuantity(itemId) {
    const quantitySpan = document.getElementById(`quantity-${itemId}`);
    let quantity = parseInt(quantitySpan.textContent);
    quantitySpan.textContent = quantity + 1;
}

function decreaseQuantity(itemId) {
    const quantitySpan = document.getElementById(`quantity-${itemId}`);
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 1) {
        quantitySpan.textContent = quantity - 1;
    }
}

function addBuyItem(itemId, itemPrice){
    const quantitySpan = document.getElementById(`quantity-${itemId}`);
    const quantity = parseInt(quantitySpan.textContent);

    const price = parseInt(itemPrice)
    const cost = quantity * price;

    userCharacter = 1; //수정: 임시 값
    if(userCharacter.money < cost){
        alert("돈이 부족해요...");
    }else{
        buyItems.push({itemId: itemId, quantity: quantity, cost: cost});
        quantitySpan.textContent = '1'; //구매 수량 1로 리셋
        //수정: 프론트 상에서 동적으로 사용자 돈 보유 현황 변화시켜야 함
    }
}

function confirmePurchase(){
    let totalCost = 0;
    buyItems.forEach(buyItem => {
        totalCost += buyItem.cost;
    })
    console.log(totalCost);

    //컨트롤러로 값 보내기
    fetch("/game/mart/itemList/buy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buyItems: buyItems,
            totalCost: totalCost
        })
    })
    .then(res => res.text()) // HTML 처리
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(err => {
        console.error("구매 처리 오류:", err);
        alert("구매 실패");
    });
}