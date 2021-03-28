import { Map } from 'immutable';
import { BlockState } from './BlockState';
import { Position } from './Position';
import { BlockRandomState } from './BlockRandomState';
import { Stats } from './Stats';

const ADJACENTS: Position[] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
  .map(([x, y]) => new Position(x, y));

export class FieldState {
  constructor(
    private random = new BlockRandomState(),
    private field = Map<string, BlockState>(),
    public stats = new Stats(),
  ) {
  }

  checkBlock(p: Position, depth = 0): FieldState {
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

  private setBlock(p: Position, block: Partial<BlockState> = {}) {
    const oldBlock = this.getBlock(p);
    const newBlock = {
      position: p,
      count: 0,
      checked: false,
      flag: false,
      ...this.random.value,
      ...oldBlock,
      ...block,
    };
    const newStats = this.stats.sum(newBlock, oldBlock);
    const nextField = this.field.set(p.key, newBlock);

    return new FieldState(this.random.next, nextField, newStats);
  }

  private determineAdjacents(p: Position): FieldState {
    return this.mapAdjacents(p, (nextState, q) => nextState.setBlock(q));
  }

  private mapAdjacents(p: Position, mapCallback: (nextState: FieldState, q: Position) => FieldState) {
    return FieldState.getAdjacentPositions(p).reduce(mapCallback, this as FieldState);
  }

  private tryCountAdjacents(p: Position, counter: (block?: BlockState) => unknown) {
    return FieldState.getAdjacentPositions(p).map(q => this.getBlock(q)).filter(counter).length;
  }

  static getAdjacentPositions(p: Position) {
    return ADJACENTS.map(q => p.add(q));
  }
}
