import './CheckedBlock.css';

export interface CheckedBlockProps {
  count?: number;
  mine?: boolean;
}

export function CheckedBlock({ count, mine }: CheckedBlockProps) {
  return (
    <div
      className={[
        'checked-block',
        'checked-block--count-' + count,
        mine ? 'checke-block--mine' : '',
      ].join(' ')}
    >
      {mine ? '💣' : (count || '')}
    </div>
  );
}
