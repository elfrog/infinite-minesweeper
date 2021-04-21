import { ReactNode, useRef } from 'react';
import { Position } from '../game/Position';
import { Range, useRange } from '../utils/Range';
import { SQUARE_SIZE } from '../constants';
import './Field.css';

export interface FieldProps {
  offset: Position;
  children?: (range: Range) => ReactNode;
}

export function Field({ offset, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const range = useRange(containerRef, offset);

  return (
    <div
      ref={containerRef}
      className="field"
    >
      <div
        className="field__content"
        style={{
          left: `${range.xStart * SQUARE_SIZE - offset.x}px`,
          top: `${range.yStart * SQUARE_SIZE - offset.y}px`,
          width: `${(range.xEnd - range.xStart + 1) * SQUARE_SIZE}px`,
          height: `${(range.yEnd - range.yStart + 1) * SQUARE_SIZE}px`,
        }}
      >
        {children?.(range)}
      </div>
    </div>
  );
}
