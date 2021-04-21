import { SQUARE_SIZE } from '../constants';
import { Position } from '../game/Position';
import { getCenteredSquareTextTable } from './useSquareText';

describe('useSquareText', () => {
  it('should convert text to position table', () => {
    const table = getCenteredSquareTextTable('TEST', SQUARE_SIZE * 10, SQUARE_SIZE * 10);
    const expectedValue = {
      [new Position(3, 5).key]: 'T',
      [new Position(4, 5).key]: 'E',
      [new Position(5, 5).key]: 'S',
      [new Position(6, 5).key]: 'T',
    };

    expect(table).toEqual(expectedValue);
  });

  it('should break words when length overflows', () => {
    const table = getCenteredSquareTextTable('TEST BREAK', SQUARE_SIZE * 5, SQUARE_SIZE * 10);
    const expectedValue = {
      [new Position(0, 4).key]: 'T',
      [new Position(1, 4).key]: 'E',
      [new Position(2, 4).key]: 'S',
      [new Position(3, 4).key]: 'T',
      [new Position(0, 5).key]: 'B',
      [new Position(1, 5).key]: 'R',
      [new Position(2, 5).key]: 'E',
      [new Position(3, 5).key]: 'A',
      [new Position(4, 5).key]: 'K',
    };

    expect(table).toEqual(expectedValue);
  });
});
