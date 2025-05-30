document.addEventListener('DOMContentLoaded', () => {
  const guide = document.getElementById('item-detail-guide');
  const detail = document.getElementById('item-detail');

  document.querySelectorAll('.item-slot').forEach(slot => {
    slot.addEventListener('click', function() {
      if (this.classList.contains('empty')) return;

      // 안내문 숨기고 상세정보 표시
      guide.style.display = 'none';
      detail.style.display = 'flex';

      // 상세 정보 채우기
      document.getElementById('detail-img').src = this.dataset.img;
      document.getElementById('detail-img').alt = this.dataset.name;
      //document.getElementById('detail-quantity').textContent = 'x' + this.dataset.quantity;
      document.getElementById('detail-name').textContent = this.dataset.name;
      document.getElementById('detail-desc').textContent = this.dataset.desc;
      document.getElementById('detail-price').innerHTML = 
        `<img src="/images/coin.png" class="coin-icon-sm"> ${this.dataset.price}원`;

      // 선택 효과
      document.querySelectorAll('.item-slot').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
});
