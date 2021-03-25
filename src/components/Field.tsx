import { ReactNode, useEffect, useRef, useState } from 'react';
import { SQUARE_SIZE } from './Square';
import { Position } from '../position';
import './Field.css';

const RANGE_MARGIN = 0;

export interface Range {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
};

export type FieldRangeCallback = (r: Range) => ReactNode;

export interface FieldProps {
  offset: Position;
  children: FieldRangeCallback;
}

export function *FieldRangeIterator(r: Range) {
  for (let y = r.yStart; y <= r.yEnd; y++) {
    for (let x = r.xStart; x <= r.xEnd; x++) {
      yield new Position(x, y);
    }
  }
}

export function Field({ offset, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const range = useRef<Range>({ xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 });
  const [content, setContent] = useState<ReactNode>(null);
  const [contentStyle, setContentStyle] = useState({ left: '0px', top: '0px' });

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      const xStart = Math.floor(offset.x / SQUARE_SIZE) - RANGE_MARGIN;
      const xEnd = xStart + Math.ceil(rect.width / SQUARE_SIZE) + RANGE_MARGIN;
      const yStart = Math.floor(offset.y / SQUARE_SIZE) - RANGE_MARGIN;
      const yEnd = yStart + Math.ceil(rect.height / SQUARE_SIZE) + RANGE_MARGIN;
      const oldRange = range.current;

      if (oldRange.xStart !== xStart || oldRange.yStart !== yStart || oldRange.xEnd !== xEnd || oldRange.yEnd !== yEnd) {
        range.current = { xStart, yStart, xEnd, yEnd };
        setContent(children?.(range.current));
      }

      setContentStyle({
        left: `${-offset.x}px`,
        top: `${-offset.y}px`,
      });
    }
  }, [children, containerRef, offset, range]);

  useEffect(() => {
    setContent(children?.(range.current));
  }, [children, range]);

  return (
    <div
      ref={containerRef}
      className="field"
    >
      <div
        className="field__content"
        style={contentStyle}
      >
        {content}
      </div>
    </div>
  );
}
