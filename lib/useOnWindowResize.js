// Tremor useOnWindowResize [v0.0.2]
import { useEffect } from 'react';

export const useOnWindowResize = (handler) => {
  useEffect(() => {
    const handleResize = () => {
      handler();
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [handler]);
}; 