import { useMemo } from 'react';
import { SQUARE_SIZE } from '../constants';
import { Position } from '../game/Position';

export function getCenteredSquareTextTable(
  text: string,
  width: number,
  height: number,
) {
  const textTable: Record<string, string> = {};
  const cols = Math.floor(width / SQUARE_SIZE);
  const rows = Math.floor(height / SQUARE_SIZE);
  const lines = (() => {
    if (Math.max(...text.split('\n').map((line) => line.length)) < cols) {
      return text.split('\n');
    }

    return text.split(/[\n ]/);
  })();
  const startY = Math.floor(rows / 2) - Math.floor(lines.length / 2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const startX = Math.floor(cols / 2) - Math.floor(line.length / 2);

    for (let j = 0; j < line.length; j++) {
      textTable[new Position(j + startX, i + startY).key] = line[j];
    }
  }

  return textTable;
}

export function useSquareText(
  text: string,
  width = window.innerWidth,
  height = window.innerHeight,
) {
  return useMemo(
    () => getCenteredSquareTextTable(text, width, height),
    [text, width, height],
  );
}
