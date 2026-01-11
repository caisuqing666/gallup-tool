import { useState, useEffect } from 'react';

/**
 * 打字机效果 Hook
 * @param text 要显示的文字
 * @param speed 打字速度（毫秒）
 * @param delay 开始前的延迟（毫秒）
 */
export function useTypewriter(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(false);

    let typeInterval: NodeJS.Timeout | null = null;

    const timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typeInterval) {
            clearInterval(typeInterval);
          }
          setIsTyping(false);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (typeInterval) {
        clearInterval(typeInterval);
      }
    };
  }, [text, speed, delay]);

  return { displayedText, isTyping };
}
