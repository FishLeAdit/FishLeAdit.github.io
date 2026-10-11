import type { CSSProperties } from "react";
import { Card, RANK_LABEL, SUIT_SYMBOL, isRed } from "./logic";

// Pip positions (x%, y%) for 2-10, as on a real deck. Pips in the lower
// half are drawn upside down.
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[50, 20], [50, 80]],
  3: [[50, 20], [50, 50], [50, 80]],
  4: [[30, 20], [70, 20], [30, 80], [70, 80]],
  5: [[30, 20], [70, 20], [50, 50], [30, 80], [70, 80]],
  6: [[30, 20], [70, 20], [30, 50], [70, 50], [30, 80], [70, 80]],
  7: [[30, 20], [70, 20], [50, 35], [30, 50], [70, 50], [30, 80], [70, 80]],
  8: [[30, 20], [70, 20], [50, 35], [30, 50], [70, 50], [50, 65], [30, 80], [70, 80]],
  9: [[30, 20], [70, 20], [30, 40], [70, 40], [50, 50], [30, 60], [70, 60], [30, 80], [70, 80]],
  10: [[30, 20], [70, 20], [50, 30], [30, 40], [70, 40], [30, 60], [70, 60], [50, 70], [30, 80], [70, 80]],
};

export const CARD_BACK: CSSProperties = {
  backgroundColor: "#1f3fbf",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 6px)",
  boxShadow: "inset 0 0 0 3px #fff, inset 0 0 0 4px #1f3fbf",
};

interface CardViewProps {
  card: Card;
  width: number;
  height: number;
  selected?: boolean;
  style?: CSSProperties;
  dataPile?: string;
  dataIndex?: number;
  onDoubleClick?: () => void;
}

export default function CardView({
  card,
  width,
  height,
  selected,
  style,
  dataPile,
  dataIndex,
  onDoubleClick,
}: CardViewProps) {
  const common: CSSProperties = {
    position: "absolute",
    width,
    height,
    borderRadius: Math.max(3, width * 0.06),
    border: "1px solid #000",
    touchAction: "none",
    userSelect: "none",
    ...style,
  };

  if (!card.faceUp) {
    return (
      <div
        data-pile={dataPile}
        data-index={dataIndex}
        style={{ ...common, ...CARD_BACK }}
      />
    );
  }

  const color = isRed(card.suit) ? "#c00000" : "#000";
  const symbol = SUIT_SYMBOL[card.suit];
  const corner = Math.max(9, width * 0.2);
  const pip = width * 0.21;
  // Tiny phone cards skip the pips and show one big suit instead.
  const showPips = width >= 56 && card.rank <= 10;

  return (
    <div
      data-pile={dataPile}
      data-index={dataIndex}
      onDoubleClick={onDoubleClick}
      style={{
        ...common,
        // Windows inverts a selected card.
        background: "#fff",
        color,
        filter: selected ? "invert(1)" : undefined,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 3,
          fontSize: corner,
          lineHeight: 1,
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div>{RANK_LABEL[card.rank]}</div>
        <div style={{ fontSize: corner * 0.9 }}>{symbol}</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 2,
          right: 3,
          fontSize: corner,
          lineHeight: 1,
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          textAlign: "center",
          transform: "rotate(180deg)",
        }}
      >
        <div>{RANK_LABEL[card.rank]}</div>
        <div style={{ fontSize: corner * 0.9 }}>{symbol}</div>
      </div>

      {showPips ? (
        PIPS[card.rank].map(([x, y], i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: card.rank === 1 ? pip * 2.4 : pip,
              lineHeight: 1,
              transform: `translate(-50%, -50%)${y > 50 ? " rotate(180deg)" : ""}`,
            }}
          >
            {symbol}
          </span>
        ))
      ) : card.rank > 10 ? (
        <div
          style={{
            position: "absolute",
            inset: `${height * 0.17}px ${width * 0.2}px`,
            border: `1px solid ${color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: isRed(card.suit) ? "#fff2c0" : "#e8eeff",
            fontFamily: "Times New Roman, serif",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: width * 0.34 }}>{RANK_LABEL[card.rank]}</span>
          <span style={{ fontSize: width * 0.26 }}>{symbol}</span>
        </div>
      ) : (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
            fontSize: width * 0.45,
            lineHeight: 1,
          }}
        >
          {symbol}
        </span>
      )}
    </div>
  );
}
