import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TypingArea from './components/TypingArea';
import TypingResult from './components/TypingResult';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import mediumTexts from './data/vietnamese-texts.json';
import AdBanner from './components/ads/AdBanner'; // Import component AdBanner
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

  const selectRandomText = (classNumber, type) => {
    let filteredTexts = mediumTexts.texts || [];
    
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

  useEffect(() => {
    selectRandomText(selectedClass, selectedType);
  }, [selectedClass, selectedType]);

  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0 && !isComplete) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isComplete) {
      setIsComplete(true);
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft, isComplete]);

  const handleComplete = (results) => {
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
    selectRandomText(selectedClass, selectedType);
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
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
      
               <AdBanner 
              adKey="62c7208177ee446fe0d0f64f62d6186d" 
              width={728} 
              height={90} 
            />
        <main className="app-main">
          <div className="container">
            {/* Sử dụng component AdBanner */}
           
            
            <Routes>
              <Route
                path="/"
                element={
                  !isStarted ? (
                    <div className="start-section">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Nhập tên nhân vật"
                        className="name-input"
                      />
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="class-select"
                      >
                        <option value="">Chọn lớp</option>
                        {[1, 2, 3, 4, 5].map((grade) => (
                          <option key={grade} value={grade}>Lớp {grade}</option>
                        ))}
                      </select>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
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
        {/* <AdBanner
  adKey="675a0f02ceb9a410c455c361ce701aeb"
  width={728}
  height={90}
/> */}

        <footer className="app-footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Luyện Gõ Tiếng Việt. All rights reserved.</p>
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