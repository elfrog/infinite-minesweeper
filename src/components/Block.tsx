import cn from 'classnames';
import './Block.css';

export interface BlockProps {
  flag?: boolean;
  itemBox?: boolean;
  pushed?: boolean;
}

export function Block({ flag, itemBox, pushed }: BlockProps) {
  return (
    <div className={cn('block', pushed && 'block--pushed')}>
      {flag ? '🚩' : (itemBox ? '⏰' : '')}
    </div>
  );
}
