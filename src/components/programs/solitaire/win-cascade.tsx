"use client";

import { useEffect, useRef } from "react";
import { RANK_LABEL, SUIT_SYMBOL, SUITS, Suit, isRed } from "./logic";

interface WinCascadeProps {
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;
  // Top-left corner of each foundation, in the canvas's coordinates.
  foundations: { x: number; y: number }[];
  foundationSuits: Suit[];
  onDone: () => void;
}

function renderCard(suit: Suit, rank: number, w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const r = Math.max(3, w * 0.06);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, w - 1, h - 1, r);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isRed(suit) ? "#c00000" : "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const corner = Math.max(9, w * 0.2);
  ctx.font = `bold ${corner}px Arial`;
  ctx.fillText(RANK_LABEL[rank], corner * 0.55 + 2, 3);
  ctx.fillText(SUIT_SYMBOL[suit], corner * 0.55 + 2, 3 + corner);

  ctx.textBaseline = "middle";
  ctx.font = `${w * 0.45}px Arial`;
  ctx.fillText(SUIT_SYMBOL[suit], w / 2, h * 0.55);
  return canvas;
}

// The Windows Solitaire victory animation: kings first, each card bounces
// off the floor and leaves a trail because the canvas is never cleared.
export default function WinCascade({
  width,
  height,
  cardWidth,
  cardHeight,
  foundations,
  foundationSuits,
  onDone,
}: WinCascadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const images = new Map<string, HTMLCanvasElement>();
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank++) {
        images.set(`${suit}${rank}`, renderCard(suit, rank, cardWidth, cardHeight));
      }
    }

    // Launch order: K of each foundation, then Q of each, down to the aces.
    const queue: { suit: Suit; rank: number; f: number }[] = [];
    for (let rank = 13; rank >= 1; rank--) {
      for (let f = 0; f < 4; f++) queue.push({ suit: foundationSuits[f], rank, f });
    }

    let current: { x: number; y: number; vx: number; vy: number; img: HTMLCanvasElement } | null =
      null;
    let frame = 0;
    const gravity = 0.55;

    const launch = () => {
      const next = queue.shift();
      if (!next) return false;
      const start = foundations[next.f];
      const direction = Math.random() < 0.25 ? 1 : -1;
      current = {
        x: start.x,
        y: start.y,
        vx: direction * (2 + Math.random() * 5),
        vy: -Math.random() * 9,
        img: images.get(`${next.suit}${next.rank}`)!,
      };
      return true;
    };

    launch();

    const step = () => {
      // Two physics steps per frame keeps it brisk, like the original.
      for (let i = 0; i < 2 && current; i++) {
        current.vy += gravity;
        current.x += current.vx;
        current.y += current.vy;
        if (current.y + cardHeight > height) {
          current.y = height - cardHeight;
          current.vy = -current.vy * 0.78;
        }
        ctx.drawImage(current.img, Math.round(current.x), Math.round(current.y));
        if (current.x + cardWidth < 0 || current.x > width) {
          if (!launch()) {
            current = null;
          }
        }
      }
      if (current) frame = requestAnimationFrame(step);
      else onDone();
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={onDone}
      className="absolute inset-0 z-50 cursor-default"
      aria-label="You win! Click to continue."
    />
  );
}
