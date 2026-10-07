'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
}

export function TypingAnimation({
  texts,
  speed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  loop = true,
  className,
  cursor = true,
  cursorChar = '|',
  onComplete,
}: TypingAnimationProps) {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const reducedMotion = useReducedMotion();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const completedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setCurrentText(texts[0] || '');
      setShowCursor(false);
      return;
    }

    const type = () => {
      const fullText = texts[textIndex] || '';

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      let typeSpeed = isDeleting ? deleteSpeed : speed;

      if (!isDeleting && currentText === fullText) {
        typeSpeed = pauseDuration;
        setIsDeleting(true);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        if (!loop && textIndex === texts.length - 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
          return;
        }
      }

      timeoutRef.current = setTimeout(type, typeSpeed);
    };

    const cursorInterval = setInterval(() => setShowCursor((prev) => !prev), 530);

    type();

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(cursorInterval);
    };
  }, [currentText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration, loop, reducedMotion, onComplete]);

  return (
    <span className={cn('font-display', className)} aria-live="polite">
      {currentText}
      {cursor && showCursor && <span className="animate-pulse text-accent ml-1" aria-hidden="true">{cursorChar}</span>}
    </span>
  );
}