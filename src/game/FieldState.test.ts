import { RandomState } from '../utils/RandomState';
import { FieldState } from './FieldState';
import { Position } from './Position';

function mockRandomState(mod: number, falseUntil: number = 0) {
  return new RandomState({
    mine: (_, depth) => depth > falseUntil && (depth % mod) === 1,
    itemBox: (_, depth) => depth > falseUntil && (depth % mod) === 1,
  });
}

describe('FieldState', () => {
  it('should open a none-mine block at first check', () => {
    const fieldState = new FieldState();
    const [, checkedBlock] = fieldState.checkBlock(Position.Zero);

    expect(checkedBlock.checked).toBeTruthy();
    expect(checkedBlock.mine).toBeFalsy();
  });

  it('should match mine count', () => {
    const fieldState = new FieldState(mockRandomState(2));
    const [, checkedBlock] = fieldState.checkBlock(Position.Zero);

    expect(checkedBlock.count).toBe(4);
  });

  it('can toggle flags and chord block', () => {
    const fieldState = new FieldState(mockRandomState(3));
    const [firstState] = fieldState.checkBlock(Position.Zero);
    const flaggedState = FieldState
      .getAdjacentPositions(Position.Zero)
      .reduce((state, p) => {
        if (state.getBlock(p)?.mine) {
          return state.toggleFlag(p)[0];
        }
        return state;
      }, firstState);
    const [chordedState] = flaggedState.chordBlock(Position.Zero);
    const checkedCount = FieldState
      .getAdjacentPositions(Position.Zero)
      .filter((p) => chordedState.getBlock(p)?.checked)
      .length;

    expect(firstState.canChord(Position.Zero)).toBeFalsy();
    expect(flaggedState.canChord(Position.Zero)).toBeTruthy();
    // There are 3 mines around.
    expect(checkedCount).toBe(5);
  });

  it('should propagate checked state when mine count is zero', () => {
    const fieldState = new FieldState(mockRandomState(2, 8));
    const [, ...checkedBlocks] = fieldState.checkBlock(Position.Zero);

    expect(checkedBlocks.length).toBeGreaterThanOrEqual(9);
  });
});
