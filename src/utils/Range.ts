import {
  RefObject, useEffect, useRef, useState,
} from 'react';
import { SQUARE_SIZE } from '../constants';
import { Position } from '../game/Position';

export class Range {
  static Zero = new Range(0, 0, 0, 0);

  constructor(
    public xStart: number,
    public yStart: number,
    public xEnd: number,
    public yEnd: number,
  ) {
  }

  static fromRect(x: number, y: number, width: number, height: number, cellSize: number) {
    const xStart = Math.floor(x / cellSize);
    const xEnd = xStart + Math.ceil(width / cellSize);
    const yStart = Math.floor(y / cellSize);
    const yEnd = yStart + Math.ceil(height / cellSize);

    return new Range(xStart, yStart, xEnd, yEnd);
  }

  equals(range: Range) {
    return (
      range.xStart === this.xStart
      && range.yStart === this.yStart
      && range.xEnd === this.xEnd
      && range.yEnd === this.yEnd
    );
  }

  map<T>(callback: (p: Position, i: number) => T) {
    const result: Array<T> = [];
    let index = 0;

    for (let y = this.yStart; y <= this.yEnd; y++) {
      for (let x = this.xStart; x <= this.xEnd; x++) {
        result.push(callback(new Position(x, y), index));
        index++;
      }
    }

    return result;
  }

  forEach(callback: (p: Position, i: number) => void) {
    let index = 0;

    for (let y = this.yStart; y <= this.yEnd; y++) {
      for (let x = this.xStart; x <= this.xEnd; x++) {
        callback(new Position(x, y), index);
        index++;
      }
    }
  }
}

export function useRange(ref: RefObject<Element>, offset: Position) {
  const oldRange = useRef<Range>(Range.Zero);
  const [range, setRange] = useState(Range.Zero);

  useEffect(() => {
    function updateRange() {
      const element = ref.current;

      if (element) {
        const rect = element.getBoundingClientRect();
        const newRange = Range.fromRect(offset.x, offset.y, rect.width, rect.height, SQUARE_SIZE);

        if (!newRange.equals(oldRange.current)) {
          oldRange.current = newRange;
          setRange(newRange);
        }
      }
    }

    updateRange();

    window.addEventListener('resize', updateRange, false);

    return () => {
      window.removeEventListener('resize', updateRange, false);
    };
  }, [ref, offset]);

  return range;
}
