document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const indicator = document.getElementById('indicator');
  const completeBtn = document.getElementById('completeBtn');
  const learningId = document.getElementById('learningId').value;
  const learningPass = document.getElementById('learningPass')?.value === 'true';
  let current = 0;
  // const seenPages = new Set(); // 확인한 페이지에 style 적용하도록 - 사용x

  const indicatorColors = ['#FF7B7B', '#FFE07B', '#7BBFFF', '#6CD8C9']; //페이지 +1될 때마다 컬러 바뀌도록

  function showCard(idx) {
    // seenPages.add(idx);
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === idx);
      card.style.display = (i === idx) ? 'flex' : 'none';
    });
  
    // 인디케이터
    indicator.innerHTML = '';
    for(let i = 0; i < cards.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'indicator-dot';
      dot.textContent = i + 1;
      
      // 확인한 페이지에 style 적용하도록
      // if (seenPages.has(i)) {
      //   dot.style.backgroundColor = indicatorColors[i % indicatorColors.length];
      //   dot.style.color = '#f5f5f5';
      // }

      if (i === idx) {
        dot.classList.add('active');
        dot.style.backgroundColor = indicatorColors[i % indicatorColors.length];
        dot.style.color = '#f5f5f5';
      }

      dot.addEventListener('click', () => {
        showCard(i);
        current = i;
      });
  
      indicator.appendChild(dot);
    }

    // 학습 완료 버튼: 마지막 카드에서만, 미완료일 때만 보이게
    if (completeBtn) {
      if (learningPass) {
        completeBtn.style.display = 'none';
      } else {
        completeBtn.style.display = (idx === cards.length - 1) ? 'inline-block' : 'none';
      }
    }
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    if(current > 0) current--;
    showCard(current);
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if(current < cards.length-1) current++;
    showCard(current);
  });

  // 학습 완료 버튼 클릭 시 fetch로 POST (미완료일 때만)
  if (completeBtn && !learningPass) {
    completeBtn.addEventListener('click', () => {
      fetch('/game/school/learning/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningId })
      })
      .then(res => res.json())
      .then(json => {
        if (json.result === 'success' || json.result === 'already_passed') {
          alert('학습이 완료되었습니다!');
          window.location.href = '/game/school/learning/list';
        } else {
          alert('학습 완료 처리에 실패했습니다.');
        }
      });
    });
  }

  showCard(0);
});
