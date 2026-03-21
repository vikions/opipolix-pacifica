import type { CSSProperties } from "react";

import HedgeSuggestion from "./HedgeSuggestion";
import MarketSignals from "./MarketSignals";
import PositionsTable from "./PositionsTable";
import TraderLeaderboard from "./TraderLeaderboard";

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  minHeight: "100vh",
};

const sidebarStyle: CSSProperties = {
  borderRight: "1px solid rgba(148, 163, 184, 0.2)",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(12px)",
};

const navItemStyle: CSSProperties = {
  padding: "10px 12px",
  marginBottom: "8px",
  borderRadius: "10px",
  background: "rgba(30, 41, 59, 0.7)",
  color: "#cbd5e1",
};

const mainStyle: CSSProperties = {
  padding: "24px",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

export default function Dashboard() {
  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Opipolix Pacifica</h1>
        <p style={{ color: "#94a3b8", lineHeight: 1.5 }}>
          Trading analytics for Pacifica perpetuals and Polymarket signal flow.
        </p>
        <nav style={{ marginTop: "24px" }}>
          <div style={navItemStyle}>Positions</div>
          <div style={navItemStyle}>Signals</div>
          <div style={navItemStyle}>Hedge Engine</div>
          <div style={navItemStyle}>Leaderboard</div>
        </nav>
      </aside>

      <main style={mainStyle}>
        <header style={{ marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "6px" }}>Dashboard Overview</h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Placeholder panels for account exposure, prediction shifts, and hedge ideas.
          </p>
        </header>

        <section style={gridStyle}>
          <PositionsTable />
          <MarketSignals />
          <HedgeSuggestion />
          <TraderLeaderboard />
        </section>
      </main>
    </div>
  );
}
