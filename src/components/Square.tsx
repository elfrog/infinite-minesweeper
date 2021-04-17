import cn from 'classnames';
import { Position } from '../game/Position';
import './Square.css';

export const SQUARE_SIZE = 32;

export function toSquarePosition({ x, y }: Position) {
  return new Position(Math.floor(x / SQUARE_SIZE), Math.floor(y / SQUARE_SIZE));
}

export interface SquareProps {
  position?: Position;
  checked?: boolean;
  flag?: boolean;
  itemBox?: boolean;
  pushed?: boolean;
  count?: number;
  mine?: boolean;
}

export function Square({
  position: { x, y, key } = Position.Zero,
  checked,
  flag,
  itemBox,
  pushed,
  count,
  mine,
}: SquareProps) {
  const style = {
    top: `${SQUARE_SIZE * y}px`,
    left: `${SQUARE_SIZE * x}px`,
  };
  let content = '';

  if (checked) {
    if (mine) {
      content = '💣';
    } else {
      content = `${count || ''}`;
    }
  } else if (flag) {
    content = '🚩';
  } else if (itemBox) {
    content = '⏰';
  }

  return (
    <div
      className={cn(
        'square',
        `square--count-${count}`,
        checked && 'square--checked',
        !checked && pushed && 'square--pushed',
      )}
      style={style}
      data-position={key}
    >
      {content}
    </div>
  );
}
