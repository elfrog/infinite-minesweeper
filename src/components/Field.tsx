import {
  ReactNode, useEffect, useRef, useState,
} from 'react';
import { SQUARE_SIZE } from './Square';
import { Position } from '../game/Position';
import './Field.css';

export interface Range {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}

export interface FieldProps {
  offset: Position;
  onRange?: (range: Range) => void;
  children?: ReactNode;
}

export function* FieldRangeIterator(r: Range) {
  for (let y = r.yStart; y <= r.yEnd; y++) {
    for (let x = r.xStart; x <= r.xEnd; x++) {
      yield new Position(x, y);
    }
  }
}

export function Field({ offset, onRange, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const range = useRef<Range>({
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
  });
  const [contentStyle, setContentStyle] = useState({ left: '0px', top: '0px' });

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      const xStart = Math.floor(offset.x / SQUARE_SIZE);
      const xEnd = xStart + Math.ceil(rect.width / SQUARE_SIZE);
      const yStart = Math.floor(offset.y / SQUARE_SIZE);
      const yEnd = yStart + Math.ceil(rect.height / SQUARE_SIZE);
      const oldRange = range.current;

      if (
        (oldRange.xStart !== xStart || oldRange.yStart !== yStart)
        || (oldRange.xEnd !== xEnd || oldRange.yEnd !== yEnd)
      ) {
        range.current = {
          xStart,
          yStart,
          xEnd,
          yEnd,
        };
        onRange?.(range.current);
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
