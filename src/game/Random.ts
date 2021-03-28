
export class Random {
  private nextRandom?: Random;

  constructor(
    private seed: number,
  ) {
  }

  get value() {
    return (this.seed % 1000) / 1000;
  }

  get next() {
    if (!this.nextRandom) {
      this.nextRandom = new Random(this.seed * 16807 % 2147483647);
    }

    return this.nextRandom;
  }

  bool(rate = 0.5) {
    return this.value < rate;
  }
}
