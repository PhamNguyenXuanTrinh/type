import React, { useState, useEffect, useRef } from 'react';
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
  // State management
  const [textToType, setTextToType] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isComplete, setIsComplete] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  // Refs
  const adContainerRef = useRef(null);

  // Select random text based on filters
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

  // Update text when class or type changes
  useEffect(() => {
    selectRandomText(selectedClass, selectedType);
  }, [selectedClass, selectedType]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0 && !isComplete) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isComplete) {
      setIsComplete(true);
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft, isComplete]);

  // Ad integration with proper cleanup
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const loadAdScript = () => {
      if (!adContainerRef.current) return;
      if (window.adScriptLoaded) return;

      // Create configuration script
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.atOptions = {
          'key': '675a0f02ceb9a410c455c361ce701aeb',
          'format': 'iframe',
          'height': 60,
          'width': 468,
          'params': {}
        };
      `;

      // Create ad loader script
      const adScript = document.createElement('script');
      adScript.src = '//www.highperformanceformat.com/675a0f02ceb9a410c455c361ce701aeb/invoke.js';
      adScript.async = true;
      adScript.onload = () => {
        window.adScriptLoaded = true;
        console.log('Ad script loaded successfully');
      };
      adScript.onerror = () => console.error('Failed to load ad script');

      // Append scripts to container
      adContainerRef.current.appendChild(configScript);
      adContainerRef.current.appendChild(adScript);

      return () => {
        // Cleanup function
        if (adContainerRef.current && configScript.parentNode === adContainerRef.current) {
          adContainerRef.current.removeChild(configScript);
        }
        if (adContainerRef.current && adScript.parentNode === adContainerRef.current) {
          adContainerRef.current.removeChild(adScript);
        }
        window.adScriptLoaded = false;
      };
    };

    // Delay ad loading slightly for better performance
    const adLoadTimeout = setTimeout(loadAdScript, 500);

    return () => {
      clearTimeout(adLoadTimeout);
    };
  }, []);

  // Event handlers
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

        <main className="app-main">
          <div className="container">
            {/* Ad container with ref */}
            <div 
              ref={adContainerRef} 
              className="ad-banner"
              style={{ minHeight: '60px' }}
            >
              <span className="ad-placeholder">Đang tải quảng cáo...</span>
            </div>
            
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