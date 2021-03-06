import cn from 'classnames';
import { Position } from '../game/Position';
import { SQUARE_SIZE } from '../constants';
import './Square.css';

export function toSquarePosition({ x, y }: Position) {
  return new Position(Math.floor(x / SQUARE_SIZE), Math.floor(y / SQUARE_SIZE));
}

export interface SquareProps {
  checked?: boolean;
  flag?: boolean;
  itemBox?: boolean;
  pushed?: boolean;
  count?: number;
  mine?: boolean;
  text?: string;
}

export function Square({
  checked,
  flag,
  itemBox,
  pushed,
  count = 0,
  mine,
  text,
}: SquareProps) {
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
  } else if (text) {
    content = text;
  }

  return (
    <div
      className={cn(
        'square',
        `square--count-${count}`,
        checked && 'square--checked',
        !checked && pushed && 'square--pushed',
        !checked && text && 'square--text',
      )}
      style={{
        width: `${SQUARE_SIZE}px`,
        height: `${SQUARE_SIZE}px`,
      }}
    >
      {content}
    </div>
  );
}
