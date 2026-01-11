import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  /**
   * 打字速度（毫秒）
   * @default 50
   */
  speed?: number;
  /**
   * 开始前的延迟（毫秒）
   * @default 0
   */
  delay?: number;
  /**
   * 是否在文本变化时重置（false 时会在现有文本后追加）
   * @default true
   */
  resetOnChange?: boolean;
  /**
   * 是否支持中断（true 时允许中断当前打字并开始新的）
   * @default true
   */
  interruptible?: boolean;
}

/**
 * 打字机效果 Hook
 * 支持中断、追加模式，避免闪烁
 * 
 * @param text 要显示的文字
 * @param options 配置选项
 * @returns { displayedText, isTyping, interrupt } - 显示文本、是否正在打字、中断函数
 * 
 * @example
 * // 基础用法（重置模式）
 * const { displayedText } = useTypewriter('Hello', { resetOnChange: true });
 * 
 * @example
 * // 追加模式（不重置）
 * const { displayedText } = useTypewriter('Hello', { resetOnChange: false });
 * 
 * @example
 * // 可中断模式
 * const { displayedText, interrupt } = useTypewriter('Hello', { interruptible: true });
 * interrupt(); // 中断当前打字
 */
export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
) {
  const {
    speed = 50,
    delay = 0,
    resetOnChange = true,
    interruptible = true,
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // 使用 ref 存储定时器，避免闭包问题
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef<number>(0);
  const currentTextRef = useRef<string>(text);
  const isInterruptedRef = useRef<boolean>(false);

  // 清理定时器
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
  };

  // 中断函数
  const interrupt = () => {
    if (!interruptible) return;
    isInterruptedRef.current = true;
    cleanup();
    setIsTyping(false);
  };

  useEffect(() => {
    // 如果文本没有变化且已完全显示，不执行
    if (currentTextRef.current === text && displayedText === text && !isTyping) {
      return;
    }

    // 如果不可中断且正在打字，等待完成
    if (!interruptible && isTyping && currentTextRef.current === text) {
      return;
    }

    // 重置中断标记
    isInterruptedRef.current = false;
    currentTextRef.current = text;

    // 清理之前的定时器
    cleanup();

    // 如果 resetOnChange 为 false，且当前有显示文本，且新文本是旧文本的扩展，则追加模式
    if (!resetOnChange && displayedText && text.startsWith(displayedText) && text.length > displayedText.length) {
      // 追加模式：从现有文本继续
      currentIndexRef.current = displayedText.length;
      setIsTyping(true);

      timeoutRef.current = setTimeout(() => {
        if (isInterruptedRef.current) {
          return;
        }

        typeIntervalRef.current = setInterval(() => {
          if (isInterruptedRef.current) {
            cleanup();
            setIsTyping(false);
            return;
          }

          if (currentIndexRef.current < text.length) {
            setDisplayedText(text.slice(0, currentIndexRef.current + 1));
            currentIndexRef.current++;
          } else {
            cleanup();
            setIsTyping(false);
          }
        }, speed);
      }, delay);
    } else {
      // 重置模式：清空并重新开始
      setDisplayedText('');
      setIsTyping(false);
      currentIndexRef.current = 0;

      timeoutRef.current = setTimeout(() => {
        if (isInterruptedRef.current) {
          return;
        }

        setIsTyping(true);
        typeIntervalRef.current = setInterval(() => {
          if (isInterruptedRef.current) {
            cleanup();
            setIsTyping(false);
            return;
          }

          if (currentIndexRef.current < text.length) {
            setDisplayedText(text.slice(0, currentIndexRef.current + 1));
            currentIndexRef.current++;
          } else {
            cleanup();
            setIsTyping(false);
          }
        }, speed);
      }, delay);
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, delay, resetOnChange, interruptible]);

  return { displayedText, isTyping, interrupt };
}
