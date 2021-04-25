import { useEffect, useRef } from 'react';
import { FieldState } from '../game/FieldState';
import './FieldMiniMap.css';

const MINI_MAP_WIDTH = 640;
const MINI_MAP_HEIGHT = 480;

function getPositionMinMax(fieldState: FieldState) {
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;

  for (const block of fieldState.blocks()) {
    if (block.checked) {
      if (block.position.x < minX) {
        minX = block.position.x;
      } else if (block.position.x > maxX) {
        maxX = block.position.x;
      }

      if (block.position.y < minY) {
        minY = block.position.y;
      } else if (block.position.y > maxY) {
        maxY = block.position.y;
      }
    }
  }

  return [minX, minY, maxX, maxY];
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  if (size > 5) {
    const r = size / 4;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + size, y, x + size, y + size, r);
    ctx.arcTo(x + size, y + size, x, y + size, r);
    ctx.arcTo(x, y + size, x, y, r);
    ctx.arcTo(x, y, x + size, y, r);
    ctx.closePath();
  } else {
    ctx.fillRect(x, y, size, size);
  }
}

export interface FieldMiniMapProps {
  fieldState: FieldState;
}

export function FieldMiniMap({ fieldState }: FieldMiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d');

    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio;
    const width = MINI_MAP_WIDTH;
    const height = MINI_MAP_HEIGHT;
    const ratio = height / width;
    const [minX, minY, maxX, maxY] = getPositionMinMax(fieldState);
    const fieldWidth = maxX - minX;
    const fieldHeight = maxY - minY;
    const fieldRatio = fieldHeight / fieldWidth;
    const blockSize = Math.max(ratio > fieldRatio ? width / fieldWidth : height / fieldHeight, 2);
    const drawWidth = blockSize * fieldWidth;
    const drawHeight = blockSize * fieldHeight;
    const borderSize = Math.max(blockSize / 10, 1);

    canvasElement.width = drawWidth * pixelRatio;
    canvasElement.height = drawHeight * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, drawWidth, drawHeight);

    ctx.lineWidth = borderSize;

    for (const block of fieldState.blocks()) {
      const {
        position, checked, count, mine, flag,
      } = block;
      const x = (position.x - minX) * blockSize;
      const y = (position.y - minY) * blockSize;

      if (checked) {
        if (!mine) {
          const colorValue = count > 0 ? 128 + 64 / count : 255;
          ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        } else {
          ctx.fillStyle = 'red';
        }

        ctx.strokeStyle = '#ffffff';
        drawBlock(ctx, x + borderSize, y + borderSize, blockSize - borderSize * 2);
        ctx.fill();
        ctx.stroke();
      } else if (flag) {
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = 'blue';
        drawBlock(ctx, x + borderSize, y + borderSize, blockSize - borderSize * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [fieldState]);

  return (
    <div className="field-mini-map">
      <canvas ref={canvasRef} />
    </div>
  );
}
