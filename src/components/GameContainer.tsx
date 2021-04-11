import { ReactNode } from 'react';
import cn from 'classnames';
import './GameContainer.css';

export interface GameContainerProps {
  isPaused: boolean;
  controller?: ReactNode;
  children: ReactNode;
}

export function GameContainer({ isPaused, controller, children }: GameContainerProps) {
  return (
    <div className={cn('game-container', isPaused && 'game-container--paused')}>
      <div className="game-container__field">
        {children}
      </div>
      <div className="game-container__controller">
        {controller}
      </div>
    </div>
  );
}
