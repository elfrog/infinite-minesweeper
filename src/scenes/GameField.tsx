import { useCallback, useState } from 'react';
import { Position } from '../game/Position';
import { FieldState } from '../game/FieldState';
import { Field } from '../components/Field';
import { Square, toSquarePosition } from '../components/Square';
import { MouseControl } from '../components/MouseControl';
import { Range } from '../utils/Range';

export interface GameFieldProps {
  fieldState: FieldState;
  onCheck: (p: Position) => void;
  onChord: (p: Position) => void;
  onFlag: (p: Position) => void;
}

export default function GameField({
  fieldState,
  onCheck,
  onChord,
  onFlag,
}: GameFieldProps) {
  const [offset, setOffset] = useState(Position.Zero);
  const [range, setRange] = useState<Range>(Range.Zero);
  const [pushedSquares, setPushedSquares] = useState<string[]>([]);
  const handlePan = useCallback((p: Position) => {
    setOffset(p);
  }, []);
  const handleRange = useCallback((newRange: Range) => {
    setRange(newRange);
  }, []);

  function handleDualClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    onChord(p);
  }

  function handleClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      onChord(p);
    } else {
      onCheck(p);
    }
  }

  function handleLongClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      onChord(p);
    }
  }

  function handleRightClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    onFlag(p);
  }

  function handleMouseDown(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);

    if (fieldState.canChord(p)) {
      setPushedSquares(
        FieldState.getAdjacentPositions(p)
          .filter((q) => !fieldState.getBlock(q)?.flag)
          .map((q) => q.key),
      );
    } else {
      setPushedSquares([p.key]);
    }
  }

  function handleMouseUp() {
    setPushedSquares([]);
  }

  return (
    <MouseControl
      onPan={handlePan}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onLongMouseDown={handleRightClick}
      onClick={handleClick}
      onRightClick={handleRightClick}
      onLongClick={handleLongClick}
      onDualClick={handleDualClick}
    >
      <Field offset={offset} onRange={handleRange}>
        {range.map((p) => (
          <Square
            key={p.key}
            position={p}
            pushed={pushedSquares.includes(p.key)}
            {...fieldState.getBlock(p)}
          />
        ))}
      </Field>
    </MouseControl>
  );
}
