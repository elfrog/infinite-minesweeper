import { useCallback, useState } from 'react';
import { Position } from '../game/Position';
import { FieldState } from '../game/FieldState';
import { Field } from '../components/Field';
import { Square, toSquarePosition } from '../components/Square';
import { MouseControl } from '../components/MouseControl';
import { CanvasField } from '../components/CanvasField';
import { getCanvasSquare } from '../components/CanvasSquare';
import { useSquareText } from '../utils/useSquareText';

export interface GameFieldProps {
  fieldState: FieldState;
  useCanvas?: boolean;
  squareText: string;
  onCheck: (p: Position) => void;
  onChord: (p: Position) => void;
  onFlag: (p: Position) => void;
}

export default function GameField({
  fieldState,
  useCanvas = true,
  squareText,
  onCheck,
  onChord,
  onFlag,
}: GameFieldProps) {
  const textTable = useSquareText(squareText);
  const [offset, setOffset] = useState(Position.Zero);
  const [pushedSquares, setPushedSquares] = useState<string[]>([]);
  const handlePan = useCallback((p: Position) => {
    setOffset(p);
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
      {!useCanvas && (
        <Field offset={offset}>
          {(range) => range.map((p) => (
            <Square
              key={p.key}
              pushed={pushedSquares.includes(p.key)}
              text={textTable[p.key]}
              {...fieldState.getBlock(p)}
            />
          ))}
        </Field>
      )}
      {useCanvas && (
        <CanvasField offset={offset}>
          {(range) => range.map((p) => (
            getCanvasSquare({
              pushed: pushedSquares.includes(p.key),
              text: textTable[p.key],
              ...fieldState.getBlock(p),
            })
          ))}
        </CanvasField>
      )}
    </MouseControl>
  );
}
