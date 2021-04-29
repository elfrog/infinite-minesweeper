import { RandomStateGenerator } from '../utils/RandomState';
import { BlockState } from './BlockState';

const MIN_MINE_RATE = 0.15;
const MAX_MINE_RATE = 0.3;
const ITEM_BOX_RATE = 0.05;

export type BlockRandomStateType = Pick<BlockState, 'mine' | 'itemBox'>;

export const BlockRandomStateGenerator: RandomStateGenerator<BlockRandomStateType> = {
  mine: (value, depth) => (
    // First middle block is never a mine.
    // It's 8 beacause adjacents are first checked, and middle one later.
    depth !== 8
    && value < (Math.min(MAX_MINE_RATE, MIN_MINE_RATE + Math.log10(depth) / 100))
  ),
  itemBox: (value) => value < ITEM_BOX_RATE,
};
