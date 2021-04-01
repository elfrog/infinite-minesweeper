export type PositionTuple = [number, number];

export class Position {
  constructor(
    public x: number,
    public y: number,
  ) {
  }

  get key() {
    return `${this.x},${this.y}`;
  }

  add(p: Position) {
    return new Position(this.x + p.x, this.y + p.y);
  }

  static from(key: string) {
    return new Position(...key.split(',').map(Number) as PositionTuple);
  }
}
