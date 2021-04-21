import { useEffect, useRef } from 'react';
import { useCanvasContext } from '../utils/useCanvasContext';
import { SquareProps, SQUARE_SIZE } from './Square';
import Mine from '../assets/bomb.svg';
import Flag from '../assets/flag.svg';
import Clock from '../assets/clock.svg';

const ICON_SIZE = 16;
const BORDER_SIZE = 3;
const TEXT_COLORS = [
  'white',
  '#0000ff',
  '#008000',
  '#ff0000',
  '#800080',
  '#800000',
  '#40e0d0',
  '#000000',
  '#808080',
];

function toImage(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}

const mineImage = toImage(Mine);
const flagImage = toImage(Flag);
const clockImage = toImage(Clock);

const cachedSquares = new Map<string, HTMLCanvasElement>();

function drawSquare(ctx: CanvasRenderingContext2D, {
  checked,
  flag,
  itemBox,
  count = 0,
  mine,
  pushed,
  text,
}: SquareProps) {
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (checked) {
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);

    ctx.fillStyle = checked ? '#eee' : '#aaa';
    ctx.fillRect(
      BORDER_SIZE / 2,
      BORDER_SIZE / 2,
      SQUARE_SIZE - BORDER_SIZE,
      SQUARE_SIZE - BORDER_SIZE,
    );

    if (mine) {
      ctx.drawImage(
        mineImage,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        ICON_SIZE, ICON_SIZE,
      );
    } else if (count > 0) {
      ctx.fillStyle = TEXT_COLORS[count] || 'white';
      ctx.fillText(String(count), SQUARE_SIZE / 2, SQUARE_SIZE / 2);
    }
  } else {
    ctx.beginPath();
    ctx.lineWidth = BORDER_SIZE;
    ctx.fillStyle = pushed ? '#808080' : '#d3d3d3';
    ctx.moveTo(0, SQUARE_SIZE);
    ctx.lineTo(0, 0);
    ctx.lineTo(SQUARE_SIZE, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = pushed ? '#d3d3d3' : '#808080';
    ctx.moveTo(SQUARE_SIZE, 0);
    ctx.lineTo(SQUARE_SIZE, SQUARE_SIZE);
    ctx.lineTo(0, SQUARE_SIZE);
    ctx.fill();

    ctx.fillStyle = checked ? '#eee' : '#aaa';
    ctx.fillRect(
      BORDER_SIZE,
      BORDER_SIZE,
      SQUARE_SIZE - BORDER_SIZE * 2,
      SQUARE_SIZE - BORDER_SIZE * 2,
    );

    if (flag) {
      ctx.drawImage(
        flagImage,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        ICON_SIZE, ICON_SIZE,
      );
    } else if (itemBox) {
      ctx.drawImage(
        clockImage,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        SQUARE_SIZE / 2 - ICON_SIZE / 2,
        ICON_SIZE, ICON_SIZE,
      );
    } else if (text) {
      ctx.fillStyle = '#2f4f4f';
      ctx.fillText(text, SQUARE_SIZE / 2, SQUARE_SIZE / 2);
    }
  }
}

export function getCanvasSquare(props: SquareProps) {
  const cachedKey = JSON.stringify(props);
  const cachedSquare = cachedSquares.get(cachedKey);

  if (cachedSquare) {
    return cachedSquare;
  }

  const ratio = window.devicePixelRatio;
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d', { alpha: false });

  canvasElement.width = SQUARE_SIZE * ratio;
  canvasElement.height = SQUARE_SIZE * ratio;

  if (ctx) {
    ctx.scale(ratio, ratio);
    drawSquare(ctx, props);
  }

  cachedSquares.set(cachedKey, canvasElement);

  return canvasElement;
}

export function CanvasSquare(props: SquareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useCanvasContext(canvasRef, SQUARE_SIZE, SQUARE_SIZE);

  useEffect(() => {
    if (ctx) {
      const square = getCanvasSquare(props);

      ctx.drawImage(square, 0, 0, SQUARE_SIZE, SQUARE_SIZE);
    }
  }, [props, ctx]);

  return <canvas ref={canvasRef} />;
}
