import { useEffect } from 'react';
import { FieldState } from '../game/FieldState';
import { Scoreboard } from '../components/Scoreboard';
import { StartBanner } from '../components/StartBanner';
import { useTimer } from '../utils/useTimer';

export interface GamePlayProps {
  maxSeconds: number;
  fieldState: FieldState;
  timeChanges: number[];
  onTimeOver: () => void;
}

export default function GamePlay({
  maxSeconds,
  fieldState,
  timeChanges,
  onTimeOver,
}: GamePlayProps) {
  const [seconds, timer] = useTimer(maxSeconds);

  useEffect(() => {
    timer.start();
  }, [timer]);

  useEffect(() => {
    if (seconds === 0) {
      onTimeOver?.();
    }
  }, [seconds, onTimeOver]);

  useEffect(() => {
    timeChanges.forEach((time) => {
      if (time) {
        timer.increase(time);
      }
    });
  }, [timeChanges, timer]);

  return (
    <>
      <Scoreboard
        time={seconds / maxSeconds}
        checked={fieldState.stats.checked}
        flags={fieldState.stats.flags}
      />
      <StartBanner />
    </>
  );
}
