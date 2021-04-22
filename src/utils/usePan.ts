import { RefObject, useEffect, useState } from 'react';

export type PanCallback = (dx: number, dy: number) => void;

export function usePan(containerRef: RefObject<HTMLElement>, callback: PanCallback) {
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      return () => {};
    }

    const containerElement = containerRef.current;
    let panStart = false;
    let prevX = 0;
    let prevY = 0;

    function handlePointerMove(x: number, y: number) {
      const dx = prevX - x;
      const dy = prevY - y;

      if (!panStart) {
        if (Math.abs(dx) + Math.abs(dy) > 1) {
          setIsPanning(true);
          panStart = true;
        }
      }

      if (panStart) {
        callback(dx, dy);
      }

      prevX = x;
      prevY = y;
    }

    function handlePointerStart(x: number, y: number) {
      prevX = x;
      prevY = y;
    }

    function handlePointerEnd(e: Event) {
      e.stopPropagation();
      e.preventDefault();
      setIsPanning(false);
      panStart = false;
    }

    function handleMouseMove(e: MouseEvent) {
      handlePointerMove(e.clientX, e.clientY);
    }

    function handleMouseUp(e: MouseEvent) {
      handlePointerEnd(e);
      window.removeEventListener('mouseup', handleMouseUp, false);
      window.removeEventListener('mousemove', handleMouseMove, false);
    }

    function handleMouseDown(e: MouseEvent) {
      handlePointerStart(e.clientX, e.clientY);
      window.addEventListener('mouseup', handleMouseUp, false);
      window.addEventListener('mousemove', handleMouseMove, false);
    }

    function handleTouchMove(e: TouchEvent) {
      handlePointerMove(e.touches[0].clientX || 0, e.touches[0].clientY || 0);
    }

    function handleTouchEnd(e: TouchEvent) {
      handlePointerEnd(e);
      window.removeEventListener('touchmove', handleTouchMove, false);
      window.removeEventListener('touchend', handleTouchEnd, false);
    }

    function handleTouchStart(e: TouchEvent) {
      handlePointerStart(e.touches[0].clientX || 0, e.touches[0].clientY || 0);
      window.addEventListener('touchmove', handleTouchMove, false);
      window.addEventListener('touchend', handleTouchEnd, false);
    }

    containerElement.addEventListener('mousedown', handleMouseDown, false);
    containerElement.addEventListener('touchstart', handleTouchStart, false);

    return () => {
      containerElement.removeEventListener('mousedown', handleMouseDown, false);
      window.removeEventListener('mousemove', handleMouseMove, false);
      window.removeEventListener('mouseup', handleMouseUp, false);

      containerElement.removeEventListener('touchstart', handleTouchStart, false);
      window.removeEventListener('touchmove', handleTouchMove, false);
      window.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, [containerRef, callback]);

  return isPanning;
}
