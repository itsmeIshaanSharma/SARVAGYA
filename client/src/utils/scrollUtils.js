/**
 * Scrolls the window to the top with a smooth animation
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Scrolls the window to the top immediately without animation
 */
export const scrollToTopImmediate = () => {
  window.scrollTo(0, 0);
};

/**
 * Scrolls to a specific element by ID with a smooth animation
 * @param {string} elementId - The ID of the element to scroll to
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}; 