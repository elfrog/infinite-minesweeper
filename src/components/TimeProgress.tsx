import cn from 'classnames';
import './TimeProgress.css';

export interface TimeProgressProps {
  value: number;
  max: number;
}

export function TimeProgress({ value, max }: TimeProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const barStyle = {
    width: `${percentage}%`,
  };

  return (
    <div
      className={cn(
        'time-progress',
        percentage < 20 && 'time-progress--hurry',
        percentage >= 20 && percentage < 50 && 'time-progress--warning',
      )}
    >
      <div className="time-progress__bar" style={barStyle} />
    </div>
  );
}
