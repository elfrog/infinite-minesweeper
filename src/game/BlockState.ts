import { Position } from './Position';

export interface BlockState {
  position: Position;
  count: number;
  checked: boolean;
  flag: boolean;
  mine: boolean;
  itemBox: boolean;
}
