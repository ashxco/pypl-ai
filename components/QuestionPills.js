import { useState, useRef } from 'react';
import styles from '../styles/QuestionPills.module.css';

export default function QuestionPills({ onQuestionClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const questions = [
    "What's my revenue for this month?",
    "Show me my top customers",
    "How many transactions were completed today?",
    "What's my average order value?",
    "Which products are selling best?",
    "Show me pending payments",
    "What's my conversion rate?",
    "How much did I earn last week?",
    "Show me refund requests",
    "What's my customer retention rate?",
    "Which payment methods are most popular?",
    "Show me my growth trends"
  ];

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleQuestionClick = (question) => {
    console.log('Question clicked:', question);
    if (onQuestionClick) {
      onQuestionClick(question);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.scrollContainer} ${canScrollLeft ? styles.canScrollLeft : ''} ${canScrollRight ? styles.canScrollRight : ''}`}>
        {canScrollLeft && (
          <button 
            className={`${styles.scrollButton} ${styles.left}`}
            onClick={() => scroll('left')}
          >
            ←
          </button>
        )}
        
        <div 
          ref={scrollRef}
          className={styles.pillsContainer}
          onScroll={checkScrollButtons}
        >
          {questions.map((question, index) => (
            <button
              key={index}
              className={styles.pill}
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
        
        {canScrollRight && (
          <button 
            className={`${styles.scrollButton} ${styles.right}`}
            onClick={() => scroll('right')}
          >
            →
          </button>
        )}
      </div>
    </div>
  );
} 