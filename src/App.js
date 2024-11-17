import React, { useState, useEffect } from 'react';
import TypingArea from './components/TypingArea';
import TypingResult from './components/TypingResult';
import mediumTexts from './data/vietnamese-texts.json'; // Đoạn văn bản mẫu
import './assets/css/style.css';

const App = () => {
  const [textToType, setTextToType] = useState(''); // Đoạn văn bản cần gõ
  const [isStarted, setIsStarted] = useState(false); // Trạng thái nhấn nút bắt đầu
  const [hasStartedTyping, setHasStartedTyping] = useState(false); // Trạng thái người dùng bắt đầu gõ
  const [timeLeft, setTimeLeft] = useState(60); // Đồng hồ đếm ngược
  const [isComplete, setIsComplete] = useState(false); // Trạng thái hoàn thành
  const [completedWords, setCompletedWords] = useState([]); // Kết quả từ

  // Chọn ngẫu nhiên đoạn văn bản khi bắt đầu
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mediumTexts.texts.length);
    setTextToType(mediumTexts.texts[randomIndex]);
  }, []);

  // Đếm ngược thời gian khi người dùng bắt đầu gõ chữ cái đầu tiên
  useEffect(() => {
    if (hasStartedTyping && timeLeft > 0 && !isComplete) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsComplete(true);
    }
  }, [hasStartedTyping, timeLeft, isComplete]);

  // Khi người dùng hoàn thành bài tập
  const handleComplete = (results) => {
    setCompletedWords(results);
    setIsComplete(true);
  };

  const handleStart = () => {
    setIsStarted(true); // Khi nhấn nút bắt đầu
  };

  const handleTypingStart = () => {
    if (!hasStartedTyping) {
      setHasStartedTyping(true); // Khi người dùng bắt đầu gõ
    }
  };

  return (
    <div className="app">
      <h1>Luyện Gõ Tiếng Việt</h1>
      {!isStarted ? (
        <button className="start-button" onClick={handleStart}>
          Bắt đầu
        </button>
      ) : !isComplete ? (
        <>
          <div className="timer">Thời gian còn lại: {timeLeft} giây</div>
          <TypingArea
            textToType={textToType}
            onComplete={handleComplete}
            onTypingStart={handleTypingStart} // Bắt đầu đếm ngược khi gõ
          />
        </>
      ) : (
        <TypingResult
          completedWords={completedWords}
          timeTaken={60 - timeLeft}
        />
      )}
    </div>
  );
};

export default App;
