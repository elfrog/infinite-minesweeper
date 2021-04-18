import { useCallback, useState } from 'react';
import { Position } from '../game/Position';
import { FieldState, FieldStateSetResult } from '../game/FieldState';
import { GameResult } from '../components/GameResult';
import { GameContainer } from '../components/GameContainer';
import GamePlay from './GamePlay';
import GameField from './GameField';

const MAX_GAME_SECONDS = 60;
const TIME_CHANGE_AMOUNT = 5;

type GameStatus = 'ready' | 'playing' | 'gameover';

function Game() {
  const [fieldState, setFieldState] = useState(new FieldState());
  const [status, setStatus] = useState<GameStatus>('ready');
  const [timeChanges, setTimeChanges] = useState<number[]>([]);
  const handleTimeOver = useCallback(() => {
    setStatus('gameover');
  }, []);

  function checkGameStatus() {
    if (status === 'ready') {
      setStatus('playing');
    }
  }

  function applyStateResult([newState, ...checkedBlocks]: FieldStateSetResult) {
    checkGameStatus();
    setTimeChanges(checkedBlocks.map(({ mine, position }) => {
      if (mine) {
        return -TIME_CHANGE_AMOUNT;
      }

      if (fieldState.getBlock(position)?.itemBox) {
        return TIME_CHANGE_AMOUNT;
      }

      return 0;
    }));
    setFieldState(newState);
  }

  function handleCheck(p: Position) {
    applyStateResult(fieldState.checkBlock(p));
  }

  function handleChord(p: Position) {
    applyStateResult(fieldState.chordBlock(p));
  }

  function handleFlag(p: Position) {
    const block = fieldState.getBlock(p);

    checkGameStatus();

    if (!block?.checked) {
      setFieldState(fieldState.toggleFlag(p)[0]);
    }
  }

  function handleRetry() {
    setStatus('ready');
    setFieldState(new FieldState());
  }

  return (
    <GameContainer
      isPaused={status === 'gameover'}
      panel={(
        <>
          {status === 'playing' && (
            <GamePlay
              maxSeconds={MAX_GAME_SECONDS}
              fieldState={fieldState}
              timeChanges={timeChanges}
              onTimeOver={handleTimeOver}
            />
          )}

          {status === 'gameover' && (
            <GameResult
              stats={fieldState.stats}
              onRetry={handleRetry}
            />
          )}
        </>
      )}
    >
      <GameField
        fieldState={fieldState}
        onCheck={handleCheck}
        onChord={handleChord}
        onFlag={handleFlag}
      />
    </GameContainer>
  );
}

export default Game;
