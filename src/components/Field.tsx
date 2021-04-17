import {
  ReactNode, useEffect, useRef, useState,
} from 'react';
import { SQUARE_SIZE } from './Square';
import { Position } from '../game/Position';
import { Range } from '../utils/Range';
import './Field.css';

export interface FieldProps {
  offset: Position;
  onRange?: (range: Range) => void;
  children?: ReactNode;
}

export function Field({ offset, onRange, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const range = useRef<Range>(Range.Zero);
  const [contentStyle, setContentStyle] = useState({ left: '0px', top: '0px' });

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      const newRange = Range.fromRect(offset.x, offset.y, rect.width, rect.height, SQUARE_SIZE);

      if (!newRange.equals(range.current)) {
        range.current = newRange;
        onRange?.(newRange);
      }

      setContentStyle({
        left: `${-offset.x}px`,
        top: `${-offset.y}px`,
      });
    }
  }, [onRange, containerRef, offset, range]);

  return (
    <div
      ref={containerRef}
      className="field"
    >
      <div
        className="field__content"
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}
