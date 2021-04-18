import {
  createContext, useEffect, useRef, useState,
} from 'react';
import { SQUARE_SIZE } from './Square';
import { Range } from '../utils/Range';
import { FieldProps } from './Field';
import './Field.css';

interface CanvasFieldContextProps {
  context2d?: CanvasRenderingContext2D;
}

export const CanvasFieldContext = createContext<CanvasFieldContextProps>({
});

export function CanvasField({ offset, onRange, children }: FieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const range = useRef<Range>(Range.Zero);
  const [context, setContext] = useState<CanvasFieldContextProps>({});

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      const newRange = Range.fromRect(offset.x, offset.y, rect.width, rect.height, SQUARE_SIZE);

      if (!newRange.equals(range.current)) {
        range.current = newRange;
        onRange?.(newRange);
      }
    }
  }, [onRange, containerRef, offset, range]);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');

      setContext({
        context2d: ctx || undefined,
      });
    }
  }, [canvasRef]);

  return (
    <div
      ref={containerRef}
      className="canvas-field"
    >
      <canvas
        ref={canvasRef}
      />
      <CanvasFieldContext.Provider value={context}>
        {children}
      </CanvasFieldContext.Provider>
    </div>
  );
}
