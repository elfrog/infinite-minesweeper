import { useCallback, useEffect, useState } from 'react';
import { Position } from './game/Position';
import { FieldState } from './game/FieldState';
import { BlockState } from './game/BlockState';
import { Field, FieldRangeIterator, Range } from './components/Field';
import { Square, toSquarePosition } from './components/Square';
import { MouseControl } from './components/MouseControl';
import { Scoreboard } from './components/Scoreboard';
import { StartBanner } from './components/StartBanner';
import { GameResult } from './components/GameResult';
import { GameContainer } from './components/GameContainer';
import { useTimer } from './utils/useTimer';

const MAX_GAME_SECONDS = 60;

type GameStatus = 'ready' | 'playing' | 'gameover';

function Game() {
  const [offset, setOffset] = useState(new Position(0, 0));
  const [fieldState, setFieldState] = useState(new FieldState());
  const [pushedSquares, setPushedSquares] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [range, setRange] = useState<Range>();
  const [seconds, timer] = useTimer(MAX_GAME_SECONDS);
  const handlePan = useCallback((p: Position) => {
    setOffset(p);
  }, []);
  const handleRange = useCallback((newRange: Range) => {
    setRange(newRange);
  }, []);

  useEffect(() => {
    if (seconds === 0 && status === 'playing') {
      setStatus('gameover');
    }
  }, [seconds, status]);

  function checkGameStatus() {
    if (status === 'ready') {
      setStatus('playing');
      timer.start();
    }
  }

  function applyBlockEffects(checkedBlocks: BlockState[]) {
    checkedBlocks.forEach(({ mine, position }) => {
      const oldBlock = fieldState.getBlock(position);

      if (mine) {
        timer.increase(-5);
      } else if (oldBlock?.itemBox) {
        timer.increase(5);
      }
    });
  }

  function checkBlock(p: Position) {
    const [newState, ...checkedBlocks] = fieldState.checkBlock(p);
    checkGameStatus();
    applyBlockEffects(checkedBlocks);
    setFieldState(newState);
  }

  function chordBlock(p: Position) {
    const [newState, ...checkedBlocks] = fieldState.chordBlock(p);
    checkGameStatus();
    applyBlockEffects(checkedBlocks);
    setFieldState(newState);
  }

  function toggleFlag(p: Position) {
    const block = fieldState.getBlock(p);

    checkGameStatus();

    if (!block?.checked) {
      setFieldState(fieldState.toggleFlag(p)[0]);
    }
  }

  function retry() {
    setStatus('ready');
    setFieldState(new FieldState());
    setOffset(new Position(0, 0));
    timer.reset();
  }

  function handleDualClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    chordBlock(p);
  }

  function handleClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      chordBlock(p);
    } else {
      checkBlock(p);
    }
  }

  function handleLongClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    const block = fieldState.getBlock(p);

    if (block?.checked) {
      chordBlock(p);
    }
  }

  function handleRightClick(mousePosition: Position) {
    const p = toSquarePosition(mousePosition);
    toggleFlag(p);
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
    <GameContainer
      isPaused={status === 'gameover'}
      panel={(
        <>
          {status === 'playing' && (
            <>
              <Scoreboard
                time={seconds / MAX_GAME_SECONDS}
                checked={fieldState.stats.checked}
                flags={fieldState.stats.flags}
              />
              <StartBanner />
            </>
          )}

          {status === 'gameover' && (
            <GameResult
              stats={fieldState.stats}
              onRetry={retry}
            />
          )}
        </>
      )}
    >
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
          {range && Array.from(FieldRangeIterator(range)).map((p) => (
            <Square
              key={p.key}
              x={p.x}
              y={p.y}
              pushed={pushedSquares.includes(p.key)}
              {...fieldState.getBlock(p)}
            />
          ))}
        </Field>
      </MouseControl>
    </GameContainer>
  );
}

export default Game;
