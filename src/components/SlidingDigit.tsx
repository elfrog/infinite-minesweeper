import { useEffect, useRef } from 'react';
import './SlidingDigit.css';

export interface SlidingDigitProps {
  value: number;
  position: number;
}

export function SlidingDigit({ value = 0, position = 0 }: SlidingDigitProps) {
  const currentValue = Math.abs(value) % 10;
  const prev = useRef(currentValue);
  const prevValue = prev.current;
  const style = {
    animationDelay: `${position * 100}ms`,
  };

  useEffect(() => {
    prev.current = currentValue;
  }, [currentValue]);

  return (
    <span className="sliding-digit">
      {currentValue === prevValue && (
        <span key={currentValue}>{currentValue}</span>
      )}
      {currentValue !== prevValue && (
        <>
          <span key={currentValue} style={style} className="sliding-digit__current">{currentValue}</span>
          <span key={prevValue} style={style} className="sliding-digit__prev">{prevValue}</span>
        </>
      )}
    </span>
  );
}
