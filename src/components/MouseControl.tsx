import { MouseEvent, ReactNode, useCallback, useRef } from 'react';
import { Position } from '../game/Position';
import { PanCallback, usePan } from '../utils/usePan';
import './MouseControl.css';

const LONG_CLICK_DURATION = 250;

export interface MouseControlProps {
  onMouseDown?: (p: Position) => void;
  onMouseUp?: (p: Position) => void;
  onLongMouseDown?: (p: Position) => void;
  onClick?: (p: Position) => void;
  onLongClick?: (p: Position) => void;
  onRightClick?: (p: Position) => void;
  onDualClick?: (p: Position) => void;
  onPan?: (offset: Position) => void;
  onPanEnd?: (offset: Position) => void;
  children: ReactNode;
}

export function MouseControl({
  onMouseDown,
  onMouseUp,
  onLongMouseDown,
  onClick,
  onLongClick,
  onRightClick,
  onDualClick,
  onPan,
  onPanEnd,
  children,
}: MouseControlProps) {
  const leftDown = useRef(false);
  const rightDown = useRef(false);
  const longClickTimer = useRef(0);
  const offset = useRef(new Position(0, 0));

  function cancelLongMouseDownTimer() {
    if (longClickTimer.current) {
      clearTimeout(longClickTimer.current);
      longClickTimer.current = 0;
    }
  }

  const updateOffset = useCallback<PanCallback>((dx, dy) => {
    const newOffset = new Position(offset.current.x + dx, offset.current.y + dy);
    offset.current = newOffset;
    cancelLongMouseDownTimer();
    onPan?.(newOffset);
  }, [onPan]);
  const [containerRef, isPanning] = usePan(updateOffset);

  function getMousePosition(e: MouseEvent) {
    const left = e.clientX - (containerRef.current?.clientLeft || 0);
    const top = e.clientY - (containerRef.current?.clientTop || 0);
    return new Position(left + offset.current.x, top + offset.current.y);
  }

  function handleMouseDown(e: MouseEvent) {
    const pos = getMousePosition(e);

    cancelLongMouseDownTimer();

    if (e.button === 0) {
      leftDown.current = true;
    } else if (e.button === 2) {
      rightDown.current = true;
    }

    if (leftDown.current && rightDown.current) {
      onDualClick?.(pos);
      return;
    }

    if (leftDown.current) {
      onMouseDown?.(pos);
    }

    longClickTimer.current = window.setTimeout(() => {
      longClickTimer.current = 0;
      leftDown.current = false;
      rightDown.current = false;
      onLongMouseDown?.(pos);
    }, LONG_CLICK_DURATION);
  }

  function handleMouseUp(e: MouseEvent) {
    const pos = getMousePosition(e);

    if (!isPanning) {
      if (!longClickTimer.current) {
        onLongClick?.(pos);
      }

      if (leftDown.current) {
        onClick?.(pos);
      } else if (rightDown.current) {
        onRightClick?.(pos);
      }
    } else {
      onPanEnd?.(offset.current);
    }

    leftDown.current = false;
    rightDown.current = false;

    onMouseUp?.(pos);
    cancelLongMouseDownTimer();
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  return (
    <div
      ref={containerRef}
      className={[
        'mouse-control',
        isPanning ? 'mouse-control--panning' : ''
      ].join(' ')}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
}
