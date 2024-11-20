import React from 'react';
import '../assets/css/style.css';

const TypingResult = ({ completedWords, timeTaken }) => {
  const totalWords = completedWords.length; // Tổng số từ đã gõ
  const correctWords = completedWords.filter((word) => word.isCorrect).length; // Số từ đúng
  const incorrectWords = totalWords - correctWords; // Số từ sai
  const accuracy = totalWords
    ? ((correctWords / totalWords) * 100).toFixed(2)
    : 0; // Độ chính xác (%)
  const wpm = timeTaken > 0 ? Math.round((correctWords / timeTaken) * 60) : 0; // Tốc độ gõ (WPM)

  return (
    <div className="typing-result">
      <h2>Kết quả luyện gõ</h2>
      <p>Tổng số từ: <strong>{totalWords}</strong></p>
      <p>Số từ đúng: <strong className="correct">{correctWords}</strong></p>
      <p>Số từ sai: <strong className="incorrect">{incorrectWords}</strong></p>
      <p>Độ chính xác: <strong>{accuracy}%</strong></p>
      <p>Tốc độ gõ (WPM): <strong>{wpm} từ/phút</strong></p>
      <button className="restart-button" onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  );
};

export default TypingResult;
