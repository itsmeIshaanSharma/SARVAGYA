import React, { useState, useEffect } from 'react';
import './TypeWriter.css';

const TypeWriter = ({ text, speed = 30, className = '', onComplete = () => {} }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className={`typewriter ${className}`}>
      {displayedText}
      {currentIndex < text.length && <span className="cursor">|</span>}
    </span>
  );
};

export default TypeWriter; 