import { useEffect, useRef } from 'react';
import { SQUARE_SIZE } from './Square';
import { Range, useRange } from '../utils/Range';
import { FieldProps } from './Field';
import './CanvasField.css';

export interface CanvasFieldProps extends Omit<FieldProps, 'children'> {
  children: (range: Range) => HTMLCanvasElement[];
}

export function CanvasField({ offset, children }: CanvasFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const range = useRange(containerRef, offset);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const containerElement = containerRef.current;

    if (!canvasElement || !containerElement) {
      return () => {};
    }

    const requestId = window.requestAnimationFrame(() => {
      const ctx = canvasElement.getContext('2d', { alpha: false });

      if (!ctx) {
        return;
      }

      const ratio = window.devicePixelRatio;
      const width = containerElement.clientWidth;
      const height = containerElement.clientHeight;

      canvasElement.width = width * ratio;
      canvasElement.height = height * ratio;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;

      ctx.scale(ratio, ratio);

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
  }, [offset, range, children]);

  return (
    <div
      ref={containerRef}
      className="canvas-field"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
