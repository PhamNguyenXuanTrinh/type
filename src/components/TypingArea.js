import React, { useState, useEffect } from "react";

const TypingArea = ({ textToType, onComplete, onTypingStart, timeIsUp }) => {
  const words = textToType.split(" "); // Chia đoạn văn bản thành từng từ
  const wordsPerLine = 10; // Số từ trên mỗi dòng
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Từ hiện tại
  const [currentLineIndex, setCurrentLineIndex] = useState(0); // Dòng hiện tại
  const [inputValue, setInputValue] = useState(""); // Từ đang gõ
  const [completedWords, setCompletedWords] = useState([]);

  // Lấy các dòng hiện tại và tiếp theo
  const getCurrentLines = () => {
    const currentLine = words.slice(
      currentLineIndex * wordsPerLine,
      (currentLineIndex + 1) * wordsPerLine
    );
    const nextLine = words.slice(
      (currentLineIndex + 1) * wordsPerLine,
      (currentLineIndex + 2) * wordsPerLine
    );
    const followingLine = words.slice(
      (currentLineIndex + 2) * wordsPerLine,
      (currentLineIndex + 3) * wordsPerLine
    );
    return { currentLine, nextLine, followingLine };
  };

  const { currentLine, nextLine, followingLine } = getCurrentLines();

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Gọi hàm khi người dùng bắt đầu gõ
    if (value.length === 1) {
      onTypingStart();
    }

    setInputValue(value);

    // Khi nhấn phím "Space" (khoảng trắng)
    if (value.endsWith(" ")) {
      const trimmedValue = value.trim(); // Loại bỏ khoảng trắng cuối
      const isCorrect = trimmedValue === words[currentWordIndex]; // Kiểm tra đúng/sai

      setCompletedWords([
        ...completedWords,
        { word: words[currentWordIndex], isCorrect },
      ]);

      setInputValue(""); // Reset ô nhập liệu
      setCurrentWordIndex(currentWordIndex + 1); // Chuyển sang từ tiếp theo

      // Nếu hết dòng hiện tại, chuyển sang dòng tiếp theo
      if ((currentWordIndex + 1) % wordsPerLine === 0) {
        setCurrentLineIndex(currentLineIndex + 1); // Chuyển sang dòng tiếp theo
      }
    }
  };
  useEffect(() => {
    if (timeIsUp) {
      console.log("TypingArea -> Time is up. Sending completed words...");
      onComplete(completedWords);
    }
  }, [timeIsUp, onComplete, completedWords]);

  return (
    <div className="typing-area">

      {/* Hiển thị dòng hiện tại và các dòng tiếp theo */}
      <div className="text-display">
        <div className="current-line">
          {currentLine.map((word, index) => (
            <span
              key={`current-${index}`}
              className={
                index + currentLineIndex * wordsPerLine === currentWordIndex
                  ? "highlight" // Từ đang gõ
                  : index + currentLineIndex * wordsPerLine < currentWordIndex
                  ? completedWords[index + currentLineIndex * wordsPerLine]
                      ?.isCorrect
                    ? "correct" // Từ đúng
                    : "incorrect" // Từ sai
                  : ""
              }
            >
              {word}{" "}
            </span>
          ))}
        </div>
        <div className="next-line">
          {nextLine.map((word, index) => (
            <span key={`next-${index}`}>{word} </span>
          ))}
        </div>
        <div className="following-line">
          {followingLine.map((word, index) => (
            <span key={`following-${index}`}>{word} </span>
          ))}
        </div>
      </div>

      {/* Ô nhập liệu */}
      <textarea
        className="typing-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Bắt đầu gõ từ đây..."
        disabled={timeIsUp} // Vô hiệu hóa khi hết thời gian
      />
    </div>
  );
};

export default TypingArea;
