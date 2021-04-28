import { BlockState } from './BlockState';

export class Stats {
  constructor(
    public readonly mines = 0,
    public readonly checked = 0,
    public readonly flags = 0,
    public readonly correctFlags = 0,
    public readonly clicks = 0,
  ) {
  }

  set(stats: Partial<Stats>) {
    return Object.assign(new Stats(), this, stats);
  }

  sum(newBlock: BlockState, oldBlock?: BlockState): Stats {
    return new Stats(
      Stats.count(newBlock.mine, oldBlock?.mine) + this.mines,
      Stats.count(newBlock.checked, oldBlock?.checked) + this.checked,
      Stats.count(newBlock.flag, oldBlock?.flag) + this.flags,
      Stats.count(
        newBlock.flag && newBlock.mine,
        oldBlock?.flag && oldBlock?.mine,
      ) + this.correctFlags,
      this.clicks,
    );
  }

  private static count(newValue: boolean, oldValue?: boolean) {
    if (oldValue && !newValue) {
      return -1;
    }

    if (!oldValue && newValue) {
      return 1;
    }

    return 0;
  }
}
