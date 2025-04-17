import React from 'react';

const TypingResult = ({ completedWords, timeTaken, onReplay, playerName }) => {
  const correctWords = completedWords.filter((word) => word.isCorrect).length;
  const totalWords = completedWords.length;
  const accuracy = totalWords > 0 ? ((correctWords / totalWords) * 100).toFixed(2) : 0;
  const wpm = totalWords > 0 ? Math.round((totalWords / timeTaken) * 60) : 0;

  // Xác định danh hiệu dựa trên số từ đúng
  let title = '';
  if (correctWords >= 30) {
    title = 'Huyền Thoại Gõ Phím 🏆';
  } else if (correctWords >= 20) {
    title = 'Siêu Nhân Gõ Chữ 🦸‍♂️';
  } else if (correctWords >= 15) {
    title = 'Vua Tốc Độ 👑';
  } else if (correctWords >= 10) {
    title = 'Hiệp Sĩ Gõ Phím ⚔️';
  } else if (correctWords >= 5) {
    title = 'Ngôi Sao Nhỏ 🌟';
  } else {
    title = 'Người Gõ Chữ Mới 🌱';
  }

  return (
    <div className="typing-result">
      <h2>Chúc mừng {playerName || 'Bạn'}!</h2>
      <p className="title">Danh hiệu: {title}</p>
      <p>Tốc độ: {wpm} từ/phút</p>
      <p>Độ chính xác: {accuracy}%</p>
      <p>Tổng từ: {totalWords}</p>
      <p>Số từ đúng: {correctWords}</p>
      <p>Thời gian: {timeTaken} giây</p>
      <button className="restart-button" onClick={onReplay}>
        Chơi lại
      </button>
    </div>
  );
};

export default TypingResult;