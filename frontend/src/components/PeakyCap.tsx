import type { CSSProperties } from "react";

import capGold from "../assets/caps/cap1.jpg";
import capDark from "../assets/caps/cap2.jpg";
import capRed from "../assets/caps/cap3.jpg";

type CapColor = "gold" | "dark" | "red" | "gray";

interface PeakyCapProps {
  size?: number;
  color: CapColor;
  active: boolean;
  label: string;
  onClick?: () => void;
}

const capStyles: Record<
  CapColor,
  {
    src: string;
    frame: string;
    glow: string;
    accent: string;
    filter?: string;
  }
> = {
  gold: {
    src: capGold,
    frame: "#c9a84c",
    glow: "rgba(232, 197, 94, 0.36)",
    accent: "#f1d28c",
  },
  dark: {
    src: capDark,
    frame: "#5f4a1c",
    glow: "rgba(42, 32, 16, 0.48)",
    accent: "#d4bb79",
  },
  red: {
    src: capRed,
    frame: "#8b1a1a",
    glow: "rgba(168, 32, 32, 0.34)",
    accent: "#f0b5b5",
  },
  gray: {
    src: capDark,
    frame: "#5a5550",
    glow: "rgba(90, 85, 80, 0.34)",
    accent: "#d5d1cb",
    filter: "grayscale(1) contrast(1.05) brightness(0.86)",
  },
};

export default function PeakyCap({
  size = 84,
  color,
  active,
  label,
  onClick,
}: PeakyCapProps) {
  const palette = capStyles[color];

  const buttonStyle: CSSProperties = {
    appearance: "none",
    border: `1px solid ${active ? palette.frame : "rgba(148, 163, 184, 0.18)"}`,
    background: active ? "rgba(13, 19, 33, 0.96)" : "rgba(8, 14, 26, 0.78)",
    borderRadius: "24px",
    padding: "14px 14px 16px",
    width: `${size * 1.72}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    cursor: onClick ? "pointer" : "default",
    boxShadow: active
      ? `0 0 0 1px ${palette.frame}, 0 0 32px ${palette.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.06)`
      : "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    transform: active ? "translateY(-3px)" : "none",
    transition:
      "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease",
  };

  const imageFrameStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    borderRadius: "18px",
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.5))",
    border: `1px solid ${active ? palette.frame : "rgba(148, 163, 184, 0.14)"}`,
    minHeight: `${size * 1.02}px`,
  };

  const imageStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: `${size * 1.02}px`,
    objectFit: "cover",
    objectPosition: "center",
    filter: palette.filter,
    transform: active ? "scale(1.03)" : "scale(1)",
    transition: "transform 160ms ease, filter 160ms ease",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: active
      ? `linear-gradient(180deg, transparent 0%, ${palette.glow} 100%)`
      : "linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.12) 100%)",
    pointerEvents: "none",
  };

  const badgeStyle: CSSProperties = {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "4px 8px",
    borderRadius: "999px",
    background: "rgba(2, 6, 23, 0.72)",
    border: `1px solid ${palette.frame}`,
    color: palette.accent,
    fontSize: "0.66rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
    pointerEvents: "none",
  };

  const labelStyle: CSSProperties = {
    color: active ? "#f8fafc" : "#cbd5e1",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 1.35,
    minHeight: "2.3em",
    display: "flex",
    alignItems: "center",
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={buttonStyle}
    >
      <div style={imageFrameStyle}>
        <img src={palette.src} alt="" aria-hidden="true" style={imageStyle} />
        <div style={overlayStyle} />
        <span style={badgeStyle}>{active ? "Active" : "Desk"}</span>
      </div>
      <span style={labelStyle}>{label}</span>
    </button>
  );
}
