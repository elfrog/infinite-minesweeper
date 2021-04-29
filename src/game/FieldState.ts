import { Map } from 'immutable';
import { BlockState } from './BlockState';
import { Position } from './Position';
import { Stats } from './Stats';
import { BlockRandomStateGenerator } from './BlockRandomState';
import { RandomState } from '../utils/RandomState';

const ADJACENTS: Position[] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
  .map(([x, y]) => new Position(x, y));

export type FieldStateSetResult = [FieldState, ...BlockState[]];

export class FieldState {
  constructor(
    private random = new RandomState(BlockRandomStateGenerator, new Date().getTime()),
    private field = Map<string, BlockState>(),
    public readonly stats = new Stats(),
  ) {
  }

  checkBlock(p: Position, depth = 0): FieldStateSetResult {
    const block = this.getBlock(p);

    if (block?.checked || block?.flag) {
      return [this];
    }

    const currentState = depth === 0 ? this.click() : this;
    const determinedState = currentState.determineAdjacents(p);
    const count = determinedState.tryCountAdjacents(p, (adjacent) => adjacent?.mine);
    const [checkedState, checkedBlock] = determinedState.setBlock(p, { checked: true, count });

    if (count > 0 || checkedBlock?.mine) {
      return [checkedState, checkedBlock];
    }

    const [adjacentState, ...adjacentBlocks] = checkedState.mapAdjacents(
      p,
      (nextState, q) => nextState.checkBlock(q, depth + 1),
    );

    return [adjacentState, checkedBlock, ...adjacentBlocks];
  }

  getBlock({ key }: Position) {
    return this.field.get(key);
  }

  blocks() {
    return this.field.values();
  }

  toggleFlag(p: Position): FieldStateSetResult {
    const block = this.getBlock(p);

    if (block?.checked) {
      return [this];
    }

    return this.click().setBlock(p, { flag: !block?.flag });
  }

  chordBlock(p: Position): FieldStateSetResult {
    if (this.canChord(p)) {
      return this.click().mapAdjacents(p, (nextState, q) => nextState.checkBlock(q, 1));
    }

    return [this];
  }

  canChord(p: Position) {
    const block = this.getBlock(p);
    return block && block.checked && !block.mine && block.count === this.tryCountAdjacents(
      p,
      (adjacent) => adjacent && (adjacent.flag || (adjacent.checked && adjacent.mine)),
    );
  }

  private click() {
    return new FieldState(
      this.random,
      this.field,
      this.stats.set({ clicks: this.stats.clicks + 1 }),
    );
  }

  private setBlock(p: Position, block?: Partial<BlockState>) {
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

    return [new FieldState(this.random.next, nextField, newStats), newBlock] as FieldStateSetResult;
  }

  private determineAdjacents(p: Position): FieldState {
    return this.mapAdjacents(p, (nextState, q) => nextState.setBlock(q))[0];
  }

  private mapAdjacents(
    p: Position,
    mapCallback: (nextState: FieldState, q: Position) => FieldStateSetResult,
  ) {
    return FieldState
      .getAdjacentPositions(p)
      .reduce(([prevState, ...prevBlocks], q) => {
        const [nextState, ...newBlocks] = mapCallback(prevState, q);
        return [nextState, ...prevBlocks, ...newBlocks] as FieldStateSetResult;
      }, [this] as FieldStateSetResult);
  }

  private tryCountAdjacents(p: Position, counter: (block?: BlockState) => unknown) {
    return FieldState.getAdjacentPositions(p).map((q) => this.getBlock(q)).filter(counter).length;
  }

  static getAdjacentPositions(p: Position) {
    return ADJACENTS.map((q) => p.add(q));
  }
}
