import { useEffect, useState } from 'react';
import cn from 'classnames';
import { Position } from '../game/Position';
import { useSquareText } from '../utils/useSquareText';
import { SQUARE_SIZE } from '../constants';
import './Opening.css';

const OPENING_ANIMATION_DURATION = 1000;

export interface OpeningProps {
  brand: string;
}

export function Opening({ brand }: OpeningProps) {
  const [isHidden, setIsHidden] = useState(false);
  const textTable = useSquareText(brand);
  const squares = Object.getOwnPropertyNames(textTable)
    .map(Position.from)
    .map(({ x, y, key }) => (
      <div
        key={key}
        className="opening__square"
        style={{
          width: `${SQUARE_SIZE}px`,
          height: `${SQUARE_SIZE}px`,
          left: `${x * SQUARE_SIZE}px`,
          top: `${y * SQUARE_SIZE}px`,
        }}
      >
        {textTable[key]}
      </div>
    ));

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsHidden(true);
    }, OPENING_ANIMATION_DURATION);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div className={cn('opening', isHidden && 'opening--hidden')}>
      {squares}
    </div>
  );
}
