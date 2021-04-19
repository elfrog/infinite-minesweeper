import { useEffect, useRef } from 'react';
import { SQUARE_SIZE } from './Square';
import { Range, useRange } from '../utils/Range';
import { useCanvasContext } from '../utils/useCanvasContext';
import { FieldProps } from './Field';
import './CanvasField.css';

export interface CanvasFieldProps extends Omit<FieldProps, 'children'> {
  children: (range: Range) => HTMLCanvasElement[];
}

export function CanvasField({ offset, children }: CanvasFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useCanvasContext(
    canvasRef,
    containerRef.current?.clientWidth || 0,
    containerRef.current?.clientHeight || 0,
  );
  const range = useRange(containerRef, offset);

  useEffect(() => {
    if (!ctx) {
      return () => {};
    }

    const requestId = window.requestAnimationFrame(() => {
      const squares = children?.(range) || [];

      range.forEach((p, i) => {
        const square = squares[i];

        if (square) {
          ctx.drawImage(
            square,
            p.x * SQUARE_SIZE - offset.x,
            p.y * SQUARE_SIZE - offset.y,
            SQUARE_SIZE,
            SQUARE_SIZE,
          );
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [offset, range, children, ctx]);

  return (
    <div
      ref={containerRef}
      className="canvas-field"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
