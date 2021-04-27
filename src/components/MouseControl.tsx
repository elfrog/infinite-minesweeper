import {
  MouseEvent, ReactNode, TouchEvent, useCallback, useRef,
} from 'react';
import cn from 'classnames';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDown = useRef(false);
  const rightDown = useRef(false);
  const longClickTimer = useRef(0);
  const offset = useRef(Position.Zero);

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
  const isPanning = usePan(containerRef, updateOffset);

  function getMousePosition(e: MouseEvent) {
    const left = e.clientX - (containerRef.current?.clientLeft || 0);
    const top = e.clientY - (containerRef.current?.clientTop || 0);
    return new Position(left + offset.current.x, top + offset.current.y);
  }

  function getTouchPosition(e: TouchEvent<HTMLDivElement>) {
    const touchX = e.touches[0]?.clientX || e.changedTouches[0].clientX;
    const touchY = e.touches[0]?.clientY || e.changedTouches[0].clientY;
    const left = touchX - (containerRef.current?.clientLeft || 0);
    const top = touchY - (containerRef.current?.clientTop || 0);
    return new Position(left + offset.current.x, top + offset.current.y);
  }

  function handleMouseDown(e: MouseEvent) {
    // prevent drag selection
    e.preventDefault();
    e.stopPropagation();

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

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    const pos = getTouchPosition(e);

    cancelLongMouseDownTimer();
    onMouseDown?.(pos);

    longClickTimer.current = window.setTimeout(() => {
      longClickTimer.current = 0;
      onLongMouseDown?.(pos);
    }, LONG_CLICK_DURATION);
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    const pos = getTouchPosition(e);

    if (!isPanning) {
      if (!longClickTimer.current) {
        onLongClick?.(pos);
      } else {
        onClick?.(pos);
      }
    } else {
      onPanEnd?.(offset.current);
    }

    onMouseUp?.(pos);
    cancelLongMouseDownTimer();
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={-1}
      className={cn(
        'mouse-control',
        isPanning && 'mouse-control--panning',
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
}
