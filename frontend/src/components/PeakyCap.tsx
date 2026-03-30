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

  const customStyle = {
    "--cap-frame": palette.frame,
    "--cap-glow": palette.glow,
    "--cap-accent": palette.accent,
    "--cap-filter": palette.filter ?? "none",
    "--cap-width": `${size * 2}px`,
    "--cap-height": `${size * 1.04}px`,
  } as CSSProperties;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`peaky-cap ${active ? "is-active" : ""}`}
      data-color={color}
      style={customStyle}
    >
      <div className="peaky-cap__frame">
        <img src={palette.src} alt="" aria-hidden="true" className="peaky-cap__image" />
        <div className="peaky-cap__overlay" />
        <span className="peaky-cap__badge">{active ? "Active" : "Desk"}</span>
      </div>
      <span className="peaky-cap__label">{label}</span>
    </button>
  );
}
