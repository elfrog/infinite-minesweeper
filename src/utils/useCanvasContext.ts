import { RefObject, useEffect, useState } from 'react';

export function useCanvasContext(
  canvasRef: RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
) {
  const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

  useEffect(() => {
    if (!canvasRef.current || !width || !height) {
      return;
    }

    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d', { alpha: false });

    if (!ctx) {
      return;
    }

    const ratio = window.devicePixelRatio;

    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;

    ctx.scale(ratio, ratio);

    setContext(ctx);
  }, [canvasRef, width, height]);

  return context;
}
