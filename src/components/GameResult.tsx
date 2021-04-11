import { useEffect, useState } from 'react';
import { MemoizedScore } from './Score';
import { Stats } from '../game/Stats';
import './GameResult.css';

export interface GameResultProps {
  stats: Stats;
  onRetry?: () => void;
}

export function GameResult({ stats, onRetry }: GameResultProps) {
  const [clicks, setClicks] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEfficiency(Math.max(Math.floor(stats.checked / stats.clicks), 0));
      setClicks(stats.clicks);
      setWins(stats.correctFlags);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [stats]);

  return (
    <div className="game-result">
      <div className="game-result__panel">
        <h1>GAME OVER</h1>
        <table>
          <tbody>
            <tr>
              <th>CLICKS</th>
              <td><MemoizedScore value={clicks} startFromZero /></td>
            </tr>
            <tr>
              <th>EFFICIENCY</th>
              <td><MemoizedScore value={efficiency} startFromZero /></td>
            </tr>
            <tr>
              <th>WINS</th>
              <td><MemoizedScore value={wins} startFromZero /></td>
            </tr>
          </tbody>
        </table>

        {onRetry && (
          <button
            type="button"
            className="game-result__retry"
            onClick={onRetry}
          >
            RETRY
          </button>
        )}
      </div>
    </div>
  );
}
