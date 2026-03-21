import type { CSSProperties } from "react";

const panelStyle: CSSProperties = {
  background: "rgba(15, 23, 42, 0.7)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "16px",
  padding: "20px",
  minHeight: "220px",
};

export default function MarketSignals() {
  return (
    <section style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Signals</h3>
      <p style={{ color: "#94a3b8" }}>
        Polymarket probability changes and market signals will render here.
      </p>
    </section>
  );
}
