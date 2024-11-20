import React, { useState, useEffect } from 'react';
import TypingArea from './components/TypingArea';
import TypingResult from './components/TypingResult';
import mediumTexts from './data/vietnamese-texts.json'; // Đoạn văn bản mẫu
import './assets/css/style.css';

const App = () => {
  const [textToType, setTextToType] = useState(''); // Đoạn văn bản cần gõ
  const [isStarted, setIsStarted] = useState(false); // Trạng thái nhấn nút bắt đầu
  const [isTyping, setIsTyping] = useState(false); // Trạng thái người dùng bắt đầu gõ
  const [timeLeft, setTimeLeft] = useState(60); // Đồng hồ đếm ngược
  const [isComplete, setIsComplete] = useState(false); // Trạng thái hoàn thành
  const [completedWords, setCompletedWords] = useState([]); // Kết quả từ đã gõ

  // Chọn ngẫu nhiên đoạn văn bản khi ứng dụng tải
  useEffect(() => {
    if (mediumTexts.texts?.length > 0) {
      const randomIndex = Math.floor(Math.random() * mediumTexts.texts.length);
      setTextToType(mediumTexts.texts[randomIndex]);
    } else {
      setTextToType(''); // Nếu không có dữ liệu
    }
  }, []);

  // Đếm ngược thời gian khi người dùng bắt đầu gõ
  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0 && !isComplete) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isComplete) {
      console.log('Time is up! Completing the session.');
      setIsComplete(true); // Chuyển trạng thái hoàn thành
    }
    return () => clearInterval(timer); // Dọn dẹp interval
  }, [isTyping, timeLeft, isComplete]);

  // Khi người dùng hoàn thành bài tập (hoặc hết thời gian)
  const handleComplete = (results) => {
    console.log('App -> handleComplete Called with results:', results);
    setCompletedWords(results); // Lưu danh sách từ đã gõ
    setIsComplete(true); // Đánh dấu hoàn thành
  };

  // Khi nhấn nút bắt đầu
  const handleStart = () => {
    setIsStarted(true);
    setTimeLeft(60); // Đặt lại thời gian đếm ngược
    setCompletedWords([]); // Xóa kết quả trước đó
    setIsComplete(false); // Đặt trạng thái hoàn thành là false
    setIsTyping(false); // Đặt trạng thái gõ là false
    console.log('Session started. Timer reset to 60 seconds.');
  };

  // Khi người dùng bắt đầu gõ
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      console.log('Typing started.');
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
            timeIsUp={timeLeft === 0} // Truyền trạng thái hết thời gian
            onComplete={handleComplete}
            onTypingStart={handleTypingStart} // Bắt đầu đếm ngược khi gõ
          />
        </>
      ) : (
        <TypingResult
          completedWords={completedWords}
          timeTaken={60 - timeLeft} // Tính thời gian đã gõ
        />
      )}
    </div>
  );
};

export default App;
