import React from 'react';
import { SlidingDigit } from './SlidingDigit';

export interface ScoreProps {
  value: number;
  startFromZero?: boolean;
}

export function Score({ value, startFromZero = false }: ScoreProps) {
  const digits = Array.from(String(value)).map(Number);

  return (
    <span>
      {digits.map((digit, i) => (
        <SlidingDigit
          key={`digit-${digits.length - i - 1}`}
          value={digit}
          position={digits.length - i - 1}
          startValue={startFromZero ? 0 : undefined}
        />
      ))}
    </span>
  );
}

export const MemoizedScore = React.memo(Score);
