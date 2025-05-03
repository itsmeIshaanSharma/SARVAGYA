import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopImmediate } from '../utils/scrollUtils';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    scrollToTopImmediate();
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop; 