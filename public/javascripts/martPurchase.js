let buyItems = [];

// function increaseQuantity(itemId) {
//     const quantitySpan = document.getElementById(`quantity-${itemId}`);
//     let quantity = parseInt(quantitySpan.textContent);
//     quantitySpan.textContent = quantity + 1;
// }

// function decreaseQuantity(itemId) {
//     const quantitySpan = document.getElementById(`quantity-${itemId}`);
//     let quantity = parseInt(quantitySpan.textContent);
//     if (quantity > 1) {
//         quantitySpan.textContent = quantity - 1;
//     }
// }

// function addBuyItem(itemId, itemPrice){
//     const quantitySpan = document.getElementById(`quantity-${itemId}`);
//     const quantity = parseInt(quantitySpan.textContent);

//     const price = parseInt(itemPrice)
//     const cost = quantity * price;

//     const userMoneyDisplay = document.getElementById('userMoney');
//     const userMoneyNum = parseInt(userMoneyDisplay.textContent, 10);

//     if(userMoney < cost){
//         alert("돈이 부족해요...");
//     }else{
//         buyItems.push({itemId: itemId, quantity: quantity, cost: cost});
//         quantitySpan.textContent = '1'; //구매 수량 1로 리셋

//         //프론트 딴에서 소유 돈 업데이트
//         userMoneyDisplay.textContent = userMoneyNum - cost;
//     }
// }

// function confirmePurchase(){
//     let totalCost = 0;
//     buyItems.forEach(buyItem => {
//         totalCost += buyItem.cost;
//     })
//     console.log(totalCost);

//     //컨트롤러로 값 보내기
//     fetch("/game/mart/itemList/buy", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             buyItems: buyItems,
//             totalCost: totalCost
//         })
//     })
//     .then(res => res.text()) // HTML 처리
//     .then(html => {
//         document.open();
//         document.write(html);
//         document.close();
//     })
//     .catch(err => {
//         console.error("구매 처리 오류:", err);
//         alert("구매 실패");
//     });
// }

let selectedItemId = null;
let selectedItemPrice = 0;
let selectedQuantity = 1;

function openModal(itemId, itemName, itemPrice, itemImgPath) {
    selectedItemId = itemId;
    selectedItemPrice = parseInt(itemPrice);
    selectedQuantity = 1;

    document.getElementById("modal-item-name").textContent = itemName;
    document.getElementById("modal-item-price").textContent = selectedItemPrice;
    document.getElementById("modal-item-img").src = itemImgPath;
    document.getElementById("modal-quantity").textContent = selectedQuantity;

    document.getElementById("purchase-modal").classList.remove("hidden");
}

function changeModalQuantity(amount) {
    selectedQuantity = Math.max(1, selectedQuantity + amount);
    const total = selectedItemPrice * selectedQuantity;
    document.getElementById("modal-item-price").textContent = total;
    document.getElementById("modal-quantity").textContent = selectedQuantity;
}

function getCart() {
    const userMoneyDisplay = document.getElementById('userMoney');
    const userMoney = parseInt(userMoneyDisplay.textContent, 10);
    const cost = selectedItemPrice * selectedQuantity;

    if (userMoney < cost) {
        alert("돈이 부족해요...");
        return;
    }

    const existing = buyItems.find(item => item.itemId === selectedItemId);
    if (existing) {
        existing.quantity += selectedQuantity;
        existing.cost += cost;
    } else {
        buyItems.push({
            itemId: selectedItemId,
            name: document.getElementById("modal-item-name").textContent,
            quantity: selectedQuantity,
            cost: cost
        });
    }
    
    document.getElementById("purchase-modal").classList.add("hidden");
    updateCartUI();
}

function updateCartUI() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = '';

    let total = 0;
    buyItems.forEach(item => {
        total += item.cost;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td><img src="/images/coin.png" class="coin-icon"> ${item.cost}</td>
        `;
        cartBody.appendChild(row);
    });
    document.getElementById('cart-total').textContent = total;
}

document.getElementById('toggle-cart-btn').addEventListener('click', () => {
    const cart = document.getElementById('cart');
    cart.classList.toggle('hidden');
  });

function finishPurchase() {
    let totalCost = buyItems.reduce((sum, item) => sum + item.cost, 0);

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
    .then(res => res.text())
    .then(html => {
        document.getElementById('cart').classList.add('hidden'); // 장바구니 모달 닫히도록
        document.getElementById("complete-modal").classList.remove("hidden");
        setTimeout(() => {
            location.href = 'javascript:history.back()';
        }, 3000);
    })
    .catch(err => {
        console.error("구매 처리 오류:", err);
        alert("구매 실패");
    });

    const userMoneyDisplay = document.getElementById('userMoney');
    const userMoney = parseInt(userMoneyDisplay.textContent, 10);
    const cost = selectedItemPrice * selectedQuantity;

    buyItems.push({itemId: selectedItemId, quantity: selectedQuantity, cost});

    userMoneyDisplay.textContent = userMoney - totalCost;
}

function closeModal() {
    document.getElementById("purchase-modal").classList.add("hidden");
}