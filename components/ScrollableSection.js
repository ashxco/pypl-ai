import { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../styles/Main.module.css';

export default function ScrollableSection({ children, itemWidth = 290 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [scrollPositions, setScrollPositions] = useState([0]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const calculateScrollPositions = useCallback(() => {
    if (!containerRef.current || !contentRef.current || !isSmallScreen) return;
    
    const container = containerRef.current;
    const content = contentRef.current;
    const containerWidth = container.offsetWidth;
    const contentWidth = content.scrollWidth;
    const maxScroll = Math.max(0, contentWidth - containerWidth);
    
    if (maxScroll <= 0) {
      setScrollPositions([0]);
      setTotalPages(1);
      setCurrentPage(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    
    // Calculate scroll amount
    const scrollAmount = Math.min(itemWidth * 2, containerWidth * 0.6);
    
    // Generate all possible scroll positions by simulating arrow clicks
    const positions = [0];
    let currentPos = 0;
    
    while (currentPos < maxScroll) {
      currentPos = Math.min(currentPos + scrollAmount, maxScroll);
      positions.push(currentPos);
      
      // Prevent infinite loop
      if (positions.length > 20) break;
    }
    
    setScrollPositions(positions);
    setTotalPages(positions.length);
    
    // Find current page based on closest scroll position
    const currentPageIndex = positions.findIndex((pos, index) => {
      const nextPos = positions[index + 1];
      if (!nextPos) return true; // Last position
      return scrollPosition >= pos && scrollPosition < nextPos;
    });
    
    setCurrentPage(Math.max(0, currentPageIndex));
    setCanScrollLeft(scrollPosition > 0);
    setCanScrollRight(scrollPosition < maxScroll);
  }, [scrollPosition, isSmallScreen, itemWidth]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1330;
      setIsSmallScreen(isSmall);
      
      if (!isSmall) {
        setScrollPosition(0);
        setCurrentPage(0);
        setTotalPages(1);
        setScrollPositions([0]);
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    };

    const handleResize = () => {
      checkScreenSize();
      // Reset scroll position on resize to avoid weird states
      setScrollPosition(0);
      setCurrentPage(0);
      // Recalculate after a short delay to ensure DOM has updated
      setTimeout(() => calculateScrollPositions(), 100);
    };

    checkScreenSize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateScrollPositions]);

  useEffect(() => {
    // Multiple calculation attempts to ensure DOM is ready
    const timeouts = [50, 100, 200, 300].map(delay => 
      setTimeout(() => calculateScrollPositions(), delay)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, [calculateScrollPositions, children]);

  // Also recalculate when scroll position changes (for real-time updates)
  useEffect(() => {
    if (isSmallScreen) {
      calculateScrollPositions();
    }
  }, [scrollPosition, calculateScrollPositions, isSmallScreen]);

  const scroll = (direction) => {
    if (!containerRef.current || !contentRef.current) return;
    
    const container = containerRef.current;
    const content = contentRef.current;
    const containerWidth = container.offsetWidth;
    const contentWidth = content.scrollWidth;
    const maxScroll = Math.max(0, contentWidth - containerWidth);
    const scrollAmount = Math.min(itemWidth * 2, containerWidth * 0.6);
    
    let newPosition;
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    }
    
    setScrollPosition(newPosition);
  };

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < scrollPositions.length) {
      setScrollPosition(scrollPositions[pageIndex]);
    }
  };

  if (!isSmallScreen) {
    return <>{children}</>;
  }

  // Build class names for the container
  const containerClasses = [
    styles.scrollableContainer,
    canScrollLeft ? styles.canScrollLeft : '',
    canScrollRight ? styles.canScrollRight : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <div className={containerClasses} ref={containerRef}>
        <button
          className={`${styles.navArrow} ${styles.left}`}
          onClick={() => scroll('left')}
        >
          <i className="ph ph-caret-left"></i>
        </button>
        
        <div
          className={styles.scrollableContent}
          ref={contentRef}
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {children}
        </div>
        
        <button
          className={`${styles.navArrow} ${styles.right}`}
          onClick={() => scroll('right')}
        >
          <i className="ph ph-caret-right"></i>
        </button>
      </div>
      
      {totalPages > 1 && (
        <div className={styles.swipeDots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`${styles.swipeDot} ${currentPage === index ? styles.active : ''}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </>
  );
} 