import {
  RefObject, useEffect, useRef, useState,
} from 'react';

export type PanCallback = (dx: number, dy: number) => void;

export function usePan(callback: PanCallback) {
  const ref = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const element = ref.current;

    let panStart = false;

    function handleMouseMove(e: MouseEvent) {
      e.preventDefault();

      const dx = -e.movementX;
      const dy = -e.movementY;

      if (!panStart) {
        if (Math.abs(dx) + Math.abs(dy) > 0) {
          setIsPanning(true);
          panStart = true;
        }
      }

      if (panStart) {
        callback(dx, dy);
      }
    }

    function handleMouseUp() {
      window.removeEventListener('mousemove', handleMouseMove, false);
      window.removeEventListener('mouseup', handleMouseUp, false);
      setIsPanning(false);
      panStart = false;
    }

    function handleMouseDown() {
      window.addEventListener('mousemove', handleMouseMove, false);
      window.addEventListener('mouseup', handleMouseUp, false);
    }

    element?.addEventListener('mousedown', handleMouseDown, false);

    return () => {
      element?.removeEventListener('mousedown', handleMouseDown, false);
      window.removeEventListener('mousemove', handleMouseMove, false);
      window.removeEventListener('mouseup', handleMouseUp, false);
    };
  }, [callback]);

  return [ref, isPanning] as [RefObject<HTMLDivElement>, boolean];
}
