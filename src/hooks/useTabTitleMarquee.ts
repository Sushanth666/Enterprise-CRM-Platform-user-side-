import { useEffect } from 'react';

interface UseTabTitleMarqueeOptions {
  speed?: number; // Milliseconds per shift
  separator?: string;
}

/**
 * Creates a smooth moving marquee animation in the browser tab title (document.title).
 * Perfect for long titles that get truncated by browser tab widths.
 */
export const useTabTitleMarquee = (
  baseText: string = 'VedaFlow - Sales Intelligence Platform',
  options: UseTabTitleMarqueeOptions = {}
) => {
  const { speed = 250, separator = ' • ' } = options;

  useEffect(() => {
    // Ensure spacing so the loop wraps seamlessly
    const fullText = `${baseText.trim()}${separator}`;
    let charIndex = 0;

    const intervalId = window.setInterval(() => {
      charIndex = (charIndex + 1) % fullText.length;
      document.title = fullText.slice(charIndex) + fullText.slice(0, charIndex);
    }, speed);

    return () => {
      window.clearInterval(intervalId);
      document.title = baseText;
    };
  }, [baseText, speed, separator]);
};
