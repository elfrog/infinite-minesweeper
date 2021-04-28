import { Position } from './Position';

export interface BlockState {
  readonly position: Position;
  readonly count: number;
  readonly checked: boolean;
  readonly flag: boolean;
  readonly mine: boolean;
  readonly itemBox: boolean;
}
