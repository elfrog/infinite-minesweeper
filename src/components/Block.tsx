import './Block.css';

export interface BlockProps {
  flag?: boolean;
  itemBox?: boolean;
  pushed?: boolean;
}

export function Block({ flag, itemBox, pushed }: BlockProps) {
  return (
    <div className={['block', pushed ? 'block--pushed' : ''].join(' ')}>
      {flag ? '🚩' : (itemBox ? '⏰' : '')}
    </div>
  );
}
