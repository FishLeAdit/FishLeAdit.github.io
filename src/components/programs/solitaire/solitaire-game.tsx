"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Win98Button } from "@/components/shared/win-98-button";
import CardView, { CARD_BACK } from "./card-view";
import WinCascade from "./win-cascade";
import {
  DrawCount,
  GameState,
  PileId,
  autoWin,
  drawFromStock,
  foundationFor,
  getPile,
  isWon,
  move,
  newGame,
} from "./logic";

interface Saved {
  game: GameState;
  history: GameState[];
  seconds: number;
  started: boolean;
}

// Minimising a window unmounts its contents; keep the game across that.
let saved: Saved | null = null;

interface Drag {
  pile: PileId;
  index: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  active: boolean;
}

type Target = { pile: PileId; index: number };

const DOUBLE_CLICK_MS = 350;

export default function SolitaireGame() {
  const [game, setGame] = useState<GameState>(() => saved?.game ?? newGame(1));
  const [history, setHistory] = useState<GameState[]>(saved?.history ?? []);
  const [seconds, setSeconds] = useState(saved?.seconds ?? 0);
  const [started, setStarted] = useState(saved?.started ?? false);
  // finished = won and the "Deal again?" dialog was dismissed.
  const [phase, setPhase] = useState<"playing" | "cascade" | "won" | "finished">(() =>
    saved && isWon(saved.game) ? "finished" : "playing",
  );
  const [selection, setSelection] = useState<Target | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [size, setSize] = useState({ w: 600, h: 400 });

  const outerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const lastClick = useRef<{ target: Target; time: number } | null>(null);

  useEffect(() => {
    saved = { game, history, seconds, started };
  }, [game, history, seconds, started]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- Layout ---------------------------------------------------------------
  // Real Windows cards are 71x96; shrink to fit narrow windows and phones.
  const pad = 8;
  const cardW = Math.max(30, Math.min(71, Math.floor((size.w - pad * 2) / 7.9)));
  const cardH = Math.round((cardW * 96) / 71);
  const gap = Math.round(cardW * 0.13);
  const boardW = 7 * cardW + 6 * gap;
  const left = Math.max(pad, (size.w - boardW) / 2);
  const colX = (col: number) => left + col * (cardW + gap);
  const topY = pad;
  const tableauY = topY + cardH + Math.round(gap * 1.8);
  const downStep = Math.max(3, Math.round(cardH * 0.06));
  const upStep = Math.round(cardH * 0.22);
  const fan = Math.round(cardW * 0.22);

  const tableauOffset = (col: number, index: number) => {
    let y = tableauY;
    const pile = game.tableau[col];
    for (let i = 0; i < index; i++) y += pile[i].faceUp ? upStep : downStep;
    return y;
  };

  const tallest = Math.max(
    ...game.tableau.map((pile, col) =>
      pile.length ? tableauOffset(col, pile.length - 1) + cardH : tableauY + cardH,
    ),
  );
  const boardH = Math.max(size.h, tallest + pad);

  // --- Moves ----------------------------------------------------------------
  const commit = useCallback(
    (next: GameState | null) => {
      if (!next) return false;
      setHistory((h) => [...h.slice(-99), game]);
      setGame(next);
      setStarted(true);
      setSelection(null);
      return true;
    },
    [game],
  );

  const deal = useCallback((drawCount: DrawCount = game.drawCount) => {
    setGame(newGame(drawCount));
    setHistory([]);
    setSeconds(0);
    setStarted(false);
    setSelection(null);
    setDrag(null);
    setPhase("playing");
  }, [game.drawCount]);

  const undo = () => {
    if (!history.length || phase !== "playing") return;
    setGame(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setSelection(null);
  };

  useEffect(() => {
    if (phase === "playing" && isWon(game)) setPhase("cascade");
  }, [game, phase]);

  useEffect(() => {
    if (!started || phase !== "playing") return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [started, phase]);

  // F2 deals; Alt+Shift+2 is the original Windows "instant win" cheat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        deal();
      } else if (e.altKey && e.shiftKey && e.code === "Digit2" && phase === "playing") {
        commit(autoWin(game));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deal, commit, game, phase]);

  // --- Pointer handling: drag to move, click to select, double click to send home.
  const targetFrom = (el: Element | null): Target | null => {
    const hit = el?.closest("[data-pile]") as HTMLElement | null;
    if (!hit) return null;
    return { pile: hit.dataset.pile as PileId, index: Number(hit.dataset.index ?? -1) };
  };

  const isMovable = (t: Target) => {
    const pile = getPile(game, t.pile);
    const card = pile[t.index];
    if (!card || !card.faceUp || t.pile === "stock") return false;
    if ((t.pile === "waste" || t.pile[0] === "f") && t.index !== pile.length - 1) return false;
    return true;
  };

  const handleClick = (target: Target | null) => {
    if (!target) {
      setSelection(null);
      return;
    }

    const now = Date.now();
    const prev = lastClick.current;
    lastClick.current = { target, time: now };
    if (
      prev &&
      now - prev.time < DOUBLE_CLICK_MS &&
      prev.target.pile === target.pile &&
      prev.target.index === target.index
    ) {
      const home = foundationFor(game, target.pile, target.index);
      if (home && commit(move(game, target.pile, target.index, home))) {
        lastClick.current = null;
        return;
      }
    }

    if (selection) {
      if (selection.pile === target.pile && selection.index === target.index) {
        setSelection(null);
        return;
      }
      if (commit(move(game, selection.pile, selection.index, target.pile))) return;
    }

    setSelection(isMovable(target) ? target : null);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (phase !== "playing" || e.button !== 0) return;
    const target = targetFrom(e.target as Element);

    if (target?.pile === "stock") {
      commit(drawFromStock(game));
      return;
    }

    if (target && isMovable(target)) {
      setDrag({ ...target, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, active: false });
    } else {
      handleClick(target);
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.active && Math.hypot(dx, dy) < 5) return;
    if (!drag.active) boardRef.current?.setPointerCapture(e.pointerId);
    setDrag({ ...drag, dx, dy, active: true });
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!drag) return;
    const current = drag;
    setDrag(null);

    if (!current.active) {
      handleClick({ pile: current.pile, index: current.index });
      return;
    }

    // Dragged cards ignore the pointer, so this finds what is underneath.
    const below = document
      .elementsFromPoint(e.clientX, e.clientY)
      .map((el) => targetFrom(el))
      .find((t) => t && t.pile !== current.pile);
    if (below) commit(move(game, current.pile, current.index, below.pile));
  };

  // --- Rendering --------------------------------------------------------------
  const isSelected = (pile: PileId, index: number) =>
    !!selection && selection.pile === pile && index >= selection.index;

  const dragStyle = (pile: PileId, index: number, z: number): CSSProperties => {
    if (drag?.active && drag.pile === pile && index >= drag.index) {
      return {
        transform: `translate(${drag.dx}px, ${drag.dy}px)`,
        zIndex: 1000 + index,
        pointerEvents: "none",
      };
    }
    return { zIndex: z };
  };

  const slot = (pile: PileId, x: number, y: number, content?: string) => (
    <div
      key={`slot-${pile}`}
      data-pile={pile}
      data-index={-1}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cardW,
        height: cardH,
        borderRadius: Math.max(3, cardW * 0.06),
        border: "1px solid #004d00",
        background: "#007000",
        color: "#00b000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: cardW * 0.6,
        fontWeight: 700,
        zIndex: 0,
      }}
    >
      {content}
    </div>
  );

  const pieces: JSX.Element[] = [];

  // Stock
  pieces.push(
    game.stock.length ? (
      <div
        key="stock"
        data-pile="stock"
        data-index={game.stock.length - 1}
        style={{
          position: "absolute",
          left: colX(0),
          top: topY,
          width: cardW,
          height: cardH,
          borderRadius: Math.max(3, cardW * 0.06),
          border: "1px solid #000",
          ...CARD_BACK,
        }}
      />
    ) : (
      slot("stock", colX(0), topY, game.waste.length ? "○" : "✕")
    ),
  );

  // Waste: top card (and the one under it, revealed while dragging), or a fan of three.
  const visibleWaste =
    game.drawCount === 3 ? Math.min(3, game.waste.length) : Math.min(2, game.waste.length);
  game.waste.slice(game.waste.length - visibleWaste).forEach((card, k) => {
    const index = game.waste.length - visibleWaste + k;
    const offset = game.drawCount === 3 ? k * fan : 0;
    pieces.push(
      <CardView
        key={card.id}
        card={card}
        width={cardW}
        height={cardH}
        dataPile="waste"
        dataIndex={index}
        selected={isSelected("waste", index)}
        style={{ left: colX(1) + offset, top: topY, ...dragStyle("waste", index, 1 + k) }}
      />,
    );
  });

  // Foundations
  game.foundations.forEach((pile, f) => {
    const pileId = `f${f}` as PileId;
    pieces.push(slot(pileId, colX(3 + f), topY));
    pile.slice(-2).forEach((card, k) => {
      const index = pile.length - Math.min(2, pile.length) + k;
      pieces.push(
        <CardView
          key={card.id}
          card={card}
          width={cardW}
          height={cardH}
          dataPile={pileId}
          dataIndex={index}
          selected={isSelected(pileId, index)}
          style={{ left: colX(3 + f), top: topY, ...dragStyle(pileId, index, 1 + k) }}
        />,
      );
    });
  });

  // Tableau: each column also gets a full-height drop zone.
  game.tableau.forEach((pile, col) => {
    const pileId = `t${col}` as PileId;
    pieces.push(
      <div
        key={`zone-${pileId}`}
        data-pile={pileId}
        data-index={-1}
        style={{
          position: "absolute",
          left: colX(col),
          top: tableauY,
          width: cardW,
          height: boardH - tableauY,
          zIndex: 0,
        }}
      />,
    );
    if (!pile.length) pieces.push(slot(pileId, colX(col), tableauY));
    pile.forEach((card, index) => {
      pieces.push(
        <CardView
          key={card.id}
          card={card}
          width={cardW}
          height={cardH}
          dataPile={pileId}
          dataIndex={index}
          selected={isSelected(pileId, index)}
          style={{
            left: colX(col),
            top: tableauOffset(col, index),
            ...dragStyle(pileId, index, 1 + index),
          }}
        />,
      );
    });
  });

  const scrollTop = boardRef.current?.scrollTop ?? 0;
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#c0c0c0]">
      <div className="flex h-7 flex-none items-center gap-1 border-b border-[#808080] px-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-fit px-2 py-0 rounded-none border border-transparent hover:border-black hover:border-t-white hover:border-l-white text-sm">
            <span className="underline">G</span>ame
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="crt w-44 py-[2px] px-0 shadow-none bg-[#C0C0C0] border border-b-black border-r-black border-t-white border-l-white rounded-none z-[1100]"
          >
            <DropdownMenuItem className="menu-button flex justify-between" onClick={() => deal()}>
              <span>Deal</span>
              <span>F2</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={history.length ? "menu-button" : "menu-button-disabled"}
              onClick={undo}
            >
              Undo
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-t-[#808080] border-b border-b-white mx-[2px]" />
            <DropdownMenuItem className="menu-button" onClick={() => deal(1)}>
              {game.drawCount === 1 ? "✓ " : "   "}Draw One
            </DropdownMenuItem>
            <DropdownMenuItem className="menu-button" onClick={() => deal(3)}>
              {game.drawCount === 3 ? "✓ " : "   "}Draw Three
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div ref={outerRef} className="relative min-h-0 flex-1">
        <div
          ref={boardRef}
          className="absolute inset-0 overflow-auto select-none"
          style={{ background: "#008000" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDrag(null)}
        >
          <div style={{ position: "relative", width: "100%", height: boardH }}>{pieces}</div>
        </div>

        {phase === "cascade" && (
          <WinCascade
            width={Math.round(size.w)}
            height={Math.round(size.h)}
            cardWidth={cardW}
            cardHeight={cardH}
            foundations={game.foundations.map((_, f) => ({ x: colX(3 + f), y: topY - scrollTop }))}
            foundationSuits={game.foundations.map((pile) => pile[0].suit)}
            onDone={() => setPhase("won")}
          />
        )}

        {phase === "won" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
            <div className="w-72 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0]">
              <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-0.5 text-sm font-bold text-white">
                Solitaire
              </div>
              <div className="p-4 text-sm">
                <p className="mb-1 font-semibold">Congratulations, you won!</p>
                <p className="mb-4">
                  Score: {game.score} &nbsp; Time: {time}
                </p>
                <p className="mb-3">Deal again?</p>
                <div className="flex justify-end gap-2">
                  <Win98Button onClick={() => deal()}>Yes</Win98Button>
                  <Win98Button onClick={() => setPhase("finished")}>No</Win98Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-6 flex-none items-center justify-end gap-6 border-t border-white px-3 text-xs">
        <span>Score: {game.score}</span>
        <span>Time: {time}</span>
      </div>
    </div>
  );
}
