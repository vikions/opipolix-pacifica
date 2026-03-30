import type { CSSProperties } from "react";

type CapColor = "gold" | "dark" | "red" | "gray";

interface PeakyCapProps {
  size?: number;
  color: CapColor;
  active: boolean;
  label: string;
  onClick?: () => void;
}

const colorSchemes: Record<
  CapColor,
  { fill: string; band: string; stroke: string; glow: string }
> = {
  gold: {
    fill: "#c9a84c",
    band: "#8b1a1a",
    stroke: "#e8c55e",
    glow: "rgba(232, 197, 94, 0.45)",
  },
  dark: {
    fill: "#2a2010",
    band: "#3a2e10",
    stroke: "#c9a84c",
    glow: "rgba(201, 168, 76, 0.35)",
  },
  red: {
    fill: "#8b1a1a",
    band: "#c9a84c",
    stroke: "#a82020",
    glow: "rgba(168, 32, 32, 0.38)",
  },
  gray: {
    fill: "#3a3530",
    band: "#8b1a1a",
    stroke: "#5a5550",
    glow: "rgba(90, 85, 80, 0.42)",
  },
};

export default function PeakyCap({
  size = 48,
  color,
  active,
  label,
  onClick,
}: PeakyCapProps) {
  const palette = colorSchemes[color];

  const buttonStyle: CSSProperties = {
    appearance: "none",
    border: `1px solid ${active ? palette.stroke : "rgba(148, 163, 184, 0.18)"}`,
    background: active ? "rgba(18, 24, 38, 0.92)" : "rgba(11, 18, 32, 0.74)",
    borderRadius: "22px",
    padding: "16px 18px 14px",
    minWidth: `${size * 2.4}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    cursor: onClick ? "pointer" : "default",
    boxShadow: active
      ? `0 0 0 1px ${palette.stroke}, 0 0 28px ${palette.glow}, inset 0 0 24px rgba(15, 23, 42, 0.6)`
      : "inset 0 0 18px rgba(15, 23, 42, 0.45)",
    transform: active ? "translateY(-2px)" : "none",
    transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
  };

  const labelStyle: CSSProperties = {
    color: active ? "#f8e7bb" : "#cbd5e1",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 1.3,
  };

  const seamStroke = {
    stroke: palette.stroke,
    strokeWidth: 2.35,
    strokeLinecap: "round" as const,
    fill: "none",
    opacity: 0.78,
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={buttonStyle}
    >
      <svg
        viewBox="0 0 140 118"
        width={size * 1.9}
        height={size * 1.35}
        role="img"
        aria-hidden="true"
      >
        <ellipse cx="79" cy="91" rx="38" ry="11" fill="rgba(0, 0, 0, 0.24)" />

        <path
          d="M33 58c8-23 27-37 51-39 20-2 38 4 49 17 8 9 11 18 8 28-4 16-20 25-43 28-28 4-49-1-59-15-5-7-7-12-6-19z"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M34 64c13-8 33-12 55-11 18 1 32 5 39 10-2 7-8 12-17 16-12 4-28 6-46 4-18-1-30-5-37-10-4-3-6-6-6-9 0 0 5 0 12 0z"
          fill={palette.band}
          stroke={palette.stroke}
          strokeWidth="2.2"
          opacity="0.96"
        />

        <path
          d="M65 77c11-8 28-11 45-9 11 1 20 4 26 8-1 4-4 7-9 9-8 4-21 6-34 5-13-1-24-4-31-8-4-2-6-4-7-5 1 0 4 0 10 0z"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        <path
          d="M44 77c6-6 18-10 34-11 15-1 29 1 37 4 4 2 6 3 8 5-4 5-11 8-22 10-13 3-27 3-40 0-8-2-14-5-17-8z"
          fill="rgba(0, 0, 0, 0.12)"
          opacity="0.3"
        />

        <circle
          cx="75"
          cy="24"
          r="6"
          fill={palette.band}
          stroke={palette.stroke}
          strokeWidth="2"
        />

        <path d="M75 24c-10 10-18 24-20 41" {...seamStroke} />
        <path d="M75 24c2 14 3 26 1 41" {...seamStroke} />
        <path d="M75 24c12 9 19 22 22 38" {...seamStroke} />
        <path d="M75 24c21 4 32 15 37 30" {...seamStroke} />
        <path d="M75 24c-23 4-37 16-43 33" {...seamStroke} />
        <path d="M56 31c11 8 17 20 17 34" {...seamStroke} />
        <path d="M92 31c-3 10-3 21 1 34" {...seamStroke} />

        <path
          d="M57 72c10-7 30-10 49-8 14 1 25 5 31 11-2 3-5 6-10 8-9 4-22 6-35 5-15-1-28-5-36-10-4-2-6-4-7-6 2 0 5 0 8 0z"
          fill={palette.fill}
          opacity="0.24"
        />
      </svg>

      <span style={labelStyle}>{label}</span>
    </button>
  );
}
