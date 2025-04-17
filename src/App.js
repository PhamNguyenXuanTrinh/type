import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TypingArea from './components/TypingArea';
import TypingResult from './components/TypingResult';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import mediumTexts from './data/vietnamese-texts.json';
import './assets/css/style.css';

const App = () => {
  const [textToType, setTextToType] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isComplete, setIsComplete] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [playerName, setPlayerName] = useState('');

  // Hàm chọn ngẫu nhiên văn bản
  const selectRandomText = (classNumber, type) => {
    let filteredTexts = mediumTexts.texts;
    if (classNumber) {
      filteredTexts = filteredTexts.filter(
        (text) => text.class === parseInt(classNumber)
      );
    }
    if (type) {
      filteredTexts = filteredTexts.filter((text) => text.type === type);
    }
    if (filteredTexts.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredTexts.length);
      setTextToType(filteredTexts[randomIndex].content);
    } else {
      setTextToType('Không có văn bản phù hợp.');
    }
  };

  // Cập nhật văn bản khi thay đổi lớp hoặc loại bài
  useEffect(() => {
    if (selectedClass || selectedType) {
      selectRandomText(selectedClass, selectedType);
    } else if (mediumTexts.texts?.length > 0) {
      const randomIndex = Math.floor(Math.random() * mediumTexts.texts.length);
      setTextToType(mediumTexts.texts[randomIndex].content);
    } else {
      setTextToType('');
    }
  }, [selectedClass, selectedType]);

  // Đếm ngược thời gian
  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0 && !isComplete) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isComplete) {
      console.log('Time is up! Completing the session.');
      setIsComplete(true);
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft, isComplete]);

  const handleComplete = (results) => {
    console.log('App -> handleComplete Called with results:', results);
    setCompletedWords(results);
    setIsComplete(true);
  };

  const handleStart = () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên nhân vật!');
      return;
    }
    setIsStarted(true);
    setTimeLeft(60);
    setCompletedWords([]);
    setIsComplete(false);
    setIsTyping(false);
    console.log('Session started. Timer reset to 60 seconds.');
    selectRandomText(selectedClass, selectedType);
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      console.log('Typing started.');
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleReplay = () => {
    setIsStarted(false);
    setIsComplete(false);
    setIsTyping(false);
    setTimeLeft(60);
    setCompletedWords([]);
    selectRandomText(selectedClass, selectedType);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>Luyện Gõ Tiếng Việt</h1>
            <nav>
              <Link to="/">Trang chủ</Link>
              <Link to="/about">Giới thiệu</Link>
              <Link to="/contact">Liên hệ</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  !isStarted ? (
                    <div className="start-section">
                      <input
                        type="text"
                        value={playerName}
                        onChange={handleNameChange}
                        placeholder="Nhập tên nhân vật"
                        className="name-input"
                      />
                      <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="class-select"
                      >
                        <option value="">Chọn lớp</option>
                        <option value="1">Lớp 1</option>
                        <option value="2">Lớp 2</option>
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                      </select>
                      <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="class-select"
                      >
                        <option value="">Chọn loại bài</option>
                        <option value="sentence">Câu ngắn</option>
                        <option value="paragraph">Đoạn văn</option>
                        <option value="poem">Thơ</option>
                      </select>
                      <button className="start-button" onClick={handleStart}>
                        Bắt đầu
                      </button>
                    </div>
                  ) : !isComplete ? (
                    <>
                      <div className="timer">Thời gian còn lại: {timeLeft} giây</div>
                      <TypingArea
                        textToType={textToType}
                        timeIsUp={timeLeft === 0}
                        onComplete={handleComplete}
                        onTypingStart={handleTypingStart}
                      />
                    </>
                  ) : (
                    <TypingResult
                      completedWords={completedWords}
                      timeTaken={60 - timeLeft}
                      onReplay={handleReplay}
                      playerName={playerName}
                    />
                  )
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>© 2025 Luyện Gõ Tiếng Việt. All rights reserved.</p>
            <nav>
              <Link to="/privacy">Chính sách bảo mật</Link>
              <Link to="/terms">Điều khoản dịch vụ</Link>
            </nav>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;