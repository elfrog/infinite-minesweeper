export type RandomStateGenerator<T> = {
  [Property in keyof T]: (v: number, c: number) => T[Property];
};

export class RandomState<T> {
  public readonly value: T;
  private nextSeed: number;
  private savedNext?: RandomState<T>;

  constructor(
    private randomObject: RandomStateGenerator<T>,
    private seed = 1,
    private depth = 0,
  ) {
    const v: Partial<T> = {};
    let nextSeed = seed;

    Object.keys(this.randomObject).forEach((key) => {
      const objectKey = key as keyof T;
      const value = (nextSeed % 1000) / 1000;
      v[objectKey] = this.randomObject[objectKey](value, this.depth);
      nextSeed = (this.seed * 16807) % 2147483647;
    });

    this.value = v as T;
    this.nextSeed = nextSeed;
  }

  get next() {
    if (!this.savedNext) {
      const nextState = new RandomState(this.randomObject, this.nextSeed, this.depth + 1);
      this.savedNext = nextState;
      return nextState;
    }

    return this.savedNext;
  }
}
