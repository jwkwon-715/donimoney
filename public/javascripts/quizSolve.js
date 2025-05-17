document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
  
    function renderQuiz(index) {
      const quiz = quizzes[index];
      const container = document.getElementById('quiz-container');
  
      let html = `<h3>${index + 1}. ${quiz.question}</h3><ul>`;
      quiz.QuizOptions.forEach((option, i) => {
        html += `
          <li>
            <input type="radio" name="option" id="option${i}" value="${option.quiz_option_index}">
            <label for="option${i}">${option.quiz_option_content}</label>
          </li>`;
      });
      html += '</ul>';
      container.innerHTML = html;

      // 해설 초기화
      const solutionBox = document.getElementById('solution-box');
      solutionBox.textContent = '';
      solutionBox.style.display = 'none';
  
      document.getElementById('check-answer-btn').style.display = 'inline-block';
      document.getElementById('next-btn').style.display = 'none';
    }
  
    function checkAnswer() {
      const selected = document.querySelector('input[name="option"]:checked');
      if (!selected) {
        alert('보기를 선택하세요');
        return;
      }
  
      const quiz = quizzes[currentIndex];
      const answer = quiz.answer;
      const solution = quiz.solution;

      const solutionBox = document.getElementById('solution-box');
  
      if (parseInt(selected.value) === answer) {
        alert('정답 처리');
      } else {
        alert('오답 처리');
      }
      solutionBox.textContent = `${solution}`;
      solutionBox.style.display = 'block';

  
      document.getElementById('check-answer-btn').style.display = 'none';
      document.getElementById('next-btn').style.display = 'inline-block';
    }
  
    function nextQuiz() {
      currentIndex++;
      if (currentIndex >= quizzes.length) {
        alert('퀴즈 끝 처리');
      }
      renderQuiz(currentIndex);
    }
  
    document.getElementById('check-answer-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuiz);
  
    renderQuiz(currentIndex);
  });
  