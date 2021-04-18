import {
  ReactNode, useEffect, useRef, useState,
} from 'react';
import { Position } from '../game/Position';
import { Range, useRange } from '../utils/Range';
import './Field.css';

export interface FieldProps {
  offset: Position;
  onRange?: (range: Range) => void;
  children?: ReactNode;
}

export function Field({ offset, onRange, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const range = useRange(containerRef, offset);
  const [contentStyle, setContentStyle] = useState({ left: '0px', top: '0px' });

  useEffect(() => {
    onRange?.(range);
  }, [onRange, range]);

  useEffect(() => {
    setContentStyle({
      left: `${-offset.x}px`,
      top: `${-offset.y}px`,
    });
  }, [offset]);

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
