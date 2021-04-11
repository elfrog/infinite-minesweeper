import { TimeProgress } from './TimeProgress';
import { Score } from './Score';
import './Scoreboard.css';

export interface ScoreboardProps {
  time: number;
  checked: number;
  flags: number;
}

export function Scoreboard({ time, checked, flags }: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <div className="scoreboard__panel">
        <div>
          <div className="scoreboard__time">
            <TimeProgress value={time} max={1} />
          </div>
        </div>
        <div>
          <div className="scoreboard__score">
            <span>☑️</span>
            <Score value={checked} />
          </div>
          <div className="scoreboard__score">
            <span>🚩</span>
            <Score value={flags} />
          </div>
        </div>
      </div>
    </div>
  );
}
