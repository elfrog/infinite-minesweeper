import { RandomState, RandomStateGenerator } from '../utils/RandomState';
import { BlockState } from './BlockState';

const MIN_MINE_RATE = 0.15;
const MAX_MINE_RATE = 0.3;
const ITEM_BOX_RATE = 0.05;

type BlockRandomStateType = Pick<BlockState, 'mine' | 'itemBox'>;

const blockRandomStateGenerator: RandomStateGenerator<BlockRandomStateType> = {
  mine: (value, depth) => (
    depth > 0
    && value < (Math.min(MAX_MINE_RATE, MIN_MINE_RATE + Math.log10(depth) / 100))
  ),
  itemBox: (value) => value < ITEM_BOX_RATE,
};

export class BlockRandomState extends RandomState<BlockRandomStateType> {
  constructor(seed: number = 1) {
    super(blockRandomStateGenerator, seed);
  }
}
