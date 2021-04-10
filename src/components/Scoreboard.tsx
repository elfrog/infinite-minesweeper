import { SlidingDigit } from './SlidingDigit';
import { TimeProgress } from './TimeProgress';
import './Scoreboard.css';

export interface ScoreboardProps {
  time: number;
  checked: number;
  flags: number;
}

function Score({ value }: { value: number }) {
  const digits = Array.from(String(value)).map(Number);

  return (
    <span>
      {digits.map((digit, i) => (
        <SlidingDigit
          key={`digit-${digits.length - i - 1}`}
          value={digit}
          position={digits.length - i - 1}
        />
      ))}
    </span>
  );
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
