import { ReactNode } from 'react';
import { Position } from '../position';
import './Square.css';

export const SQUARE_SIZE = 32;

export function toSquarePosition({ x, y }: Position) {
  return new Position(Math.floor(x / SQUARE_SIZE), Math.floor(y / SQUARE_SIZE));
}

export interface SquareProps {
  x: number;
  y: number;
  children?: ReactNode;
}

export function Square({x, y, children}: SquareProps) {
  const style = {
    top: `${SQUARE_SIZE * y}px`,
    left: `${SQUARE_SIZE * x}px`,
  };
  const { key } = new Position(x, y);

  return (
    <div
      className="square"
      style={style}
      data-position={key}
    >
      {children}
    </div>
  );
}
