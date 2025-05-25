document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    let userAnswers = []; // 사용자가 선택한 답 저장

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
        userAnswers[currentIndex] = parseInt(selected.value);

        const quiz = quizzes[currentIndex];
        const answer = quiz.answer;
        const solution = quiz.solution;

        const solutionBox = document.getElementById('solution-box');

        if (parseInt(selected.value) === answer) {
            alert('정답입니다!');
        } else {
            alert('오답입니다!');
        }
        solutionBox.textContent = `${solution}`;
        solutionBox.style.display = 'block';

        document.getElementById('check-answer-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'inline-block';
    }

    function finishQuiz() {
        let score = 0;
        quizzes.forEach((quiz, idx) => {
            if (userAnswers[idx] === quiz.answer) score++;
        });
        const finalScore = Math.round((score / quizzes.length) * 100);

        fetch('/game/school/quiz/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: quizType,
                curriculumId: selectedCurriculumId,
                score: finalScore
            })
        })
        .then(res => {
            if (res.ok) {
                window.location.href = '/game/home'; // 원하는 페이지로 이동
            } else {
                alert('퀴즈 결과 저장에 실패했습니다.');
            }
        });
    }

    function nextQuiz() {
        currentIndex++;
        if (currentIndex >= quizzes.length) {
            finishQuiz();
            return;
        }
        renderQuiz(currentIndex);
    }

    document.getElementById('check-answer-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuiz);

    renderQuiz(currentIndex);

    // slider
    let duration = 120; // 총 시간 (초)
    let progress = 0;

    const fill = document.getElementById('fill');
    const slider = document.getElementById('slider');
    const track = document.getElementById('track');

    const trackWidth = track.offsetWidth;
    const pencilHalfWidth = slider.offsetWidth / 2;

    const interval = setInterval(() => {
        progress++;

        const ratio = Math.min(progress / duration, 1);

        const fillWidth = ratio * trackWidth;
        fill.style.width = `${fillWidth}px`;

        if (fillWidth > 5) {
            slider.style.opacity = 1;
        }

        slider.style.left = `${track.offsetLeft + fillWidth - pencilHalfWidth + 45}px`;

        if (progress >= duration) {
            clearInterval(interval);
        }
    }, 1000);
});
