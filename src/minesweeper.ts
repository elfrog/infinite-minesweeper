import { Map } from 'immutable';
import { Position } from './position';
import Random from './random';

const MINE_RATE = 0.15;
const ITEM_BOX_RATE = 0.05;
const ADJACENTS: Position[] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
  .map(([x, y]) => new Position(x, y));

export interface MineBlock {
  position: Position;
  count: number;
  checked: boolean;
  flag: boolean;
  mine: boolean;
  itemBox: boolean;
}

export class MineFieldState {
  constructor(
    private random = new Random(1),
    private field = Map<string, MineBlock>(),
  ) {
  }

  checkBlock(p: Position, depth = 0): MineFieldState {
    const block = this.getBlock(p);

    if (block?.checked || block?.flag) {
      return this;
    }

    const determinedState = this.determineAdjacents(p);
    const count = determinedState.tryCountAdjacents(p, adjacent=> adjacent?.mine);
    const newState = determinedState.setBlock(p, { checked: true, count });
    const newBlock = newState.getBlock(p);

    if (count > 0 || newBlock?.mine) {
      return newState;
    }

    return newState.mapAdjacents(p, (nextState, q) => nextState.checkBlock(q, depth + 1));
  } 

  getBlock({ key }: Position) {
    return this.field.get(key);
  }

  toggleFlag(p: Position) {
    const block = this.getBlock(p);

    if (block?.checked) {
      return this;
    }

    return this.setBlock(p, { flag: !block?.flag });
  }

  chordBlock(p: Position) {
    if (this.canChord(p)) {
      return this.mapAdjacents(p, (nextState, q) => nextState.checkBlock(q));
    }

    return this;
  }

  canChord(p: Position) {
    const block = this.getBlock(p);
    return block && block.checked && !block.mine && block.count === this.tryCountAdjacents(
      p,
      adjacent => adjacent && (adjacent.flag || (adjacent.checked && adjacent.mine)),
    );
  }

  private setBlock(p: Position, block: Partial<MineBlock> = {}) {
    const oldBlock = this.getBlock(p);
    const newBlock = {
      position: p,
      count: 0,
      checked: false,
      flag: false,
      mine: this.random.bool(MINE_RATE),
      itemBox: this.random.next.bool(ITEM_BOX_RATE),
      ...oldBlock,
      ...block,
    };
    const nextField = this.field.set(p.key, newBlock);

    return new MineFieldState(this.random.next.next, nextField);
  }

  private determineAdjacents(p: Position): MineFieldState {
    return this.mapAdjacents(p, (nextState, q) => nextState.setBlock(q));
  }

  private mapAdjacents(p: Position, mapCallback: (nextState: MineFieldState, q: Position) => MineFieldState) {
    return MineFieldState.getAdjacentPositions(p).reduce(mapCallback, this as MineFieldState);
  }

  private tryCountAdjacents(p: Position, counter: (block?: MineBlock) => unknown) {
    return MineFieldState.getAdjacentPositions(p).map(q => this.getBlock(q)).filter(counter).length;
  }

  static getAdjacentPositions(p: Position) {
    return ADJACENTS.map(q => p.add(q));
  }
}
