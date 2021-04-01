import cn from 'classnames';
import './Block.css';

export interface BlockProps {
  flag?: boolean;
  itemBox?: boolean;
  pushed?: boolean;
}

export function Block({ flag, itemBox, pushed }: BlockProps) {
  let content = '';

  if (flag) {
    content = '🚩';
  } else if (itemBox) {
    content = '⏰';
  }

  return (
    <div className={cn('block', pushed && 'block--pushed')}>
      {content}
    </div>
  );
}
