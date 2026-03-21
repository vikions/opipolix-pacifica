import type { CSSProperties } from "react";

const panelStyle: CSSProperties = {
  background: "rgba(15, 23, 42, 0.7)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "16px",
  padding: "20px",
  minHeight: "220px",
};

export default function TraderLeaderboard() {
  return (
    <section style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Leaderboard</h3>
      <p style={{ color: "#94a3b8" }}>
        Pacifica trader rankings and performance snapshots will render here.
      </p>
    </section>
  );
}
