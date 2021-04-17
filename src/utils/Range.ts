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

  map<T>(callback: (p: Position) => T) {
    const result: Array<T> = [];

    for (let y = this.yStart; y <= this.yEnd; y++) {
      for (let x = this.xStart; x <= this.xEnd; x++) {
        result.push(callback(new Position(x, y)));
      }
    }

    return result;
  }
}