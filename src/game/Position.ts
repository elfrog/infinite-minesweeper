export type PositionTuple = [number, number];

export class Position {
  static Zero = new Position(0, 0);

  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {
  }

  static from(key: string) {
    return new Position(...key.split(',').map(Number) as PositionTuple);
  }

  get key() {
    return `${this.x},${this.y}`;
  }

  add(p: Position) {
    return new Position(this.x + p.x, this.y + p.y);
  }
}
