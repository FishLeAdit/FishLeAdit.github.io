// Klondike rules and Windows-style standard scoring. Pure functions: every
// move returns a new state (or null if illegal), which makes Undo trivial.

export type Suit = "S" | "H" | "D" | "C";

export interface Card {
  id: number;
  suit: Suit;
  rank: number; // 1 = Ace ... 13 = King
  faceUp: boolean;
}

export type PileId =
  | "stock"
  | "waste"
  | "f0" | "f1" | "f2" | "f3"
  | "t0" | "t1" | "t2" | "t3" | "t4" | "t5" | "t6";

export type DrawCount = 1 | 3;

export interface GameState {
  stock: Card[]; // last element is the top card
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  drawCount: DrawCount;
  score: number;
  moves: number;
}

export const SUITS: Suit[] = ["S", "H", "D", "C"];
export const SUIT_SYMBOL: Record<Suit, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };
export const RANK_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const isRed = (suit: Suit) => suit === "H" || suit === "D";

// Windows Solitaire "Standard" scoring.
const SCORE = {
  wasteToTableau: 5,
  toFoundation: 10,
  turnOver: 5,
  foundationToTableau: -15,
  recycle: { 1: -100, 3: -20 } as Record<DrawCount, number>,
};

export function newGame(drawCount: DrawCount): GameState {
  const deck: Card[] = [];
  let id = 0;
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: id++, suit, rank, faceUp: false });
    }
  }

  // Fisher-Yates shuffle.
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const tableau: Card[][] = [];
  for (let col = 0; col < 7; col++) {
    const pile = deck.splice(0, col + 1);
    pile[pile.length - 1].faceUp = true;
    tableau.push(pile);
  }

  return {
    stock: deck,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    drawCount,
    score: 0,
    moves: 0,
  };
}

function clone(state: GameState): GameState {
  return {
    ...state,
    stock: state.stock.map((c) => ({ ...c })),
    waste: state.waste.map((c) => ({ ...c })),
    foundations: state.foundations.map((p) => p.map((c) => ({ ...c }))),
    tableau: state.tableau.map((p) => p.map((c) => ({ ...c }))),
  };
}

export function getPile(state: GameState, id: PileId): Card[] {
  if (id === "stock") return state.stock;
  if (id === "waste") return state.waste;
  const index = Number(id.slice(1));
  return id[0] === "f" ? state.foundations[index] : state.tableau[index];
}

const addScore = (state: GameState, points: number) => {
  state.score = Math.max(0, state.score + points);
};

// Turn the stock over onto the waste, or recycle the waste when the stock is empty.
export function drawFromStock(state: GameState): GameState | null {
  if (state.stock.length === 0 && state.waste.length === 0) return null;

  const next = clone(state);

  if (next.stock.length === 0) {
    next.stock = next.waste.reverse().map((c) => ({ ...c, faceUp: false }));
    next.waste = [];
    addScore(next, SCORE.recycle[next.drawCount]);
  } else {
    const count = Math.min(next.drawCount, next.stock.length);
    for (let i = 0; i < count; i++) {
      const card = next.stock.pop()!;
      card.faceUp = true;
      next.waste.push(card);
    }
  }

  next.moves++;
  return next;
}

export function canPlaceOnTableau(card: Card, pile: Card[]) {
  const top = pile[pile.length - 1];
  if (!top) return card.rank === 13;
  return top.faceUp && isRed(top.suit) !== isRed(card.suit) && top.rank === card.rank + 1;
}

export function canPlaceOnFoundation(card: Card, pile: Card[]) {
  const top = pile[pile.length - 1];
  if (!top) return card.rank === 1;
  return top.suit === card.suit && top.rank === card.rank - 1;
}

// Move the cards from `index` to the end of `from` onto `to`.
export function move(
  state: GameState,
  from: PileId,
  index: number,
  to: PileId,
): GameState | null {
  if (from === to || from === "stock" || to === "stock" || to === "waste") return null;
  // Shuffling an ace between foundations would farm points.
  if (from[0] === "f" && to[0] === "f") return null;

  const source = getPile(state, from);
  const cards = source.slice(index);
  if (cards.length === 0 || cards.some((c) => !c.faceUp)) return null;

  // Only the top card can leave the waste or a foundation, or go to a foundation.
  const singleOnly = from === "waste" || from[0] === "f" || to[0] === "f";
  if (singleOnly && cards.length !== 1) return null;

  const target = getPile(state, to);
  const legal =
    to[0] === "f"
      ? canPlaceOnFoundation(cards[0], target)
      : canPlaceOnTableau(cards[0], target);
  if (!legal) return null;

  const next = clone(state);
  const nextSource = getPile(next, from);
  const moved = nextSource.splice(index);
  getPile(next, to).push(...moved);

  if (to[0] === "f") addScore(next, SCORE.toFoundation);
  else if (from === "waste") addScore(next, SCORE.wasteToTableau);
  else if (from[0] === "f") addScore(next, SCORE.foundationToTableau);

  // Turn over the card a tableau move uncovered.
  const uncovered = nextSource[nextSource.length - 1];
  if (from[0] === "t" && uncovered && !uncovered.faceUp) {
    uncovered.faceUp = true;
    addScore(next, SCORE.turnOver);
  }

  next.moves++;
  return next;
}

// Where a double-clicked card would go: the first foundation that accepts it.
export function foundationFor(state: GameState, from: PileId, index: number): PileId | null {
  const source = getPile(state, from);
  if (index !== source.length - 1) return null;

  const card = source[index];
  for (let f = 0; f < 4; f++) {
    if (canPlaceOnFoundation(card, state.foundations[f])) return `f${f}` as PileId;
  }
  return null;
}

export const isWon = (state: GameState) =>
  state.foundations.every((pile) => pile.length === 13);

// Alt+Shift+2, the original Windows Solitaire cheat: finish the game at once.
export function autoWin(state: GameState): GameState {
  const next = clone(state);
  next.foundations = SUITS.map((suit, f) =>
    Array.from({ length: 13 }, (_, i) => ({ id: f * 13 + i, suit, rank: i + 1, faceUp: true })),
  );
  next.stock = [];
  next.waste = [];
  next.tableau = [[], [], [], [], [], [], []];
  return next;
}
