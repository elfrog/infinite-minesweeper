import cn from 'classnames';
import './CheckedBlock.css';

export interface CheckedBlockProps {
  count?: number;
  mine?: boolean;
}

export function CheckedBlock({ count, mine }: CheckedBlockProps) {
  return (
    <div
      className={cn(
        'checked-block',
        `checked-block--count-${count}`,
        mine && 'checke-block--mine',
      )}
    >
      {mine ? '💣' : (count || '')}
    </div>
  );
}
