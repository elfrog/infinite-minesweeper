
export type RandomStateGenerator<T> = {
  [Property in keyof T]: (v: number, c: number) => T[Property];
};

export class RandomState<T> {
  public value: T;
  private nextSeed: number;
  private _next?: RandomState<T>;

  constructor(
    private randomObject: RandomStateGenerator<T>,
    private seed = 1,
    private depth = 0,
  ) {
    const v: Partial<T> = {};
    let nextSeed = seed;

    for (const key in this.randomObject) {
      const value = (nextSeed % 1000 / 1000);
      v[key] = this.randomObject[key](value, this.depth);
      nextSeed = this.seed * 16807 % 2147483647;
    }

    this.value = v as T;
    this.nextSeed = nextSeed;
  }

  get next() {
    if (!this._next) {
      const nextState = new RandomState(this.randomObject, this.nextSeed, this.depth + 1);
      this._next = nextState;
      return nextState;
    }

    return this._next;
  }
}
