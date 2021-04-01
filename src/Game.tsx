import { useCallback, useState } from 'react';
import { Position } from './game/Position';
import { FieldState } from './game/FieldState';
import { Field, FieldRangeIterator, Range } from './components/Field';
import { Square, toSquarePosition } from './components/Square';
import { CheckedBlock } from './components/CheckedBlock';
import { Block } from './components/Block';
import { MouseControl } from './components/MouseControl';
import { Scoreboard } from './components/Scoreboard';

function Game() {
  const [offset, setOffset] = useState(new Position(0, 0));
  const [fieldState, setFieldState] = useState(new FieldState());
  const [pushedSquares, setPushedSquares] = useState<string[]>([]);
  const handlePan = useCallback((p: Position) => {
    setOffset(p);
  }, []);
  const renderSquares = useCallback((range: Range) => (
    Array.from(FieldRangeIterator(range)).map((p) => {
      const block = fieldState.getBlock(p);

      if (block?.checked) {
        return (
          <Square key={p.key} x={p.x} y={p.y}>
            <CheckedBlock count={block.count} mine={block.mine} />
          </Square>
        );
      }

      return (
        <Square key={p.key} x={p.x} y={p.y}>
          <Block
            itemBox={block?.itemBox}
            flag={block?.flag}
            pushed={pushedSquares.includes(p.key)}
          />
        </Square>
      );
    })
  ), [fieldState, pushedSquares]);

  function handleDualClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    setFieldState(fieldState.chordBlock(p));
  }

  function handleClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      setFieldState(fieldState.chordBlock(p));
    } else {
      setFieldState(fieldState.checkBlock(p));
    }
  }

  function handleLongClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      setFieldState(fieldState.chordBlock(p));
    }
  }

  function handleRightClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (!block?.checked) {
      setFieldState(fieldState.toggleFlag(p));
    }
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
    <div className="game">
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
        <Field offset={offset}>
          {renderSquares}
        </Field>
      </MouseControl>
      <Scoreboard time={0} checked={fieldState.stats.checked} flags={fieldState.stats.flags} />
    </div>
  );
}

export default Game;
