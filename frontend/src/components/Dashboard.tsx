import { useState, type CSSProperties, type ReactNode } from "react";

import HedgeSuggestion from "./HedgeSuggestion";
import MarketSignals from "./MarketSignals";
import PeakyCap from "./PeakyCap";
import PositionsTable from "./PositionsTable";
import TraderLeaderboard from "./TraderLeaderboard";

type PanelKey = "contracts" | "reports" | "bet" | "board";

const frameStyle: CSSProperties = {
  maxWidth: "1240px",
  margin: "0 auto",
  padding: "36px 24px 42px",
};

const heroStyle: CSSProperties = {
  padding: "28px 28px 22px",
  borderRadius: "28px",
  background:
    "radial-gradient(circle at top left, rgba(201, 168, 76, 0.18), transparent 28%), rgba(15, 23, 42, 0.78)",
  border: "1px solid rgba(201, 168, 76, 0.2)",
  boxShadow: "0 28px 80px rgba(2, 6, 23, 0.38)",
};

const heroTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-block",
  marginBottom: "10px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(139, 26, 26, 0.18)",
  color: "#f3d68a",
  fontSize: "0.76rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const statStripStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const statCardStyle: CSSProperties = {
  minWidth: "140px",
  padding: "12px 14px",
  borderRadius: "16px",
  background: "rgba(15, 23, 42, 0.68)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
};

const capRailStyle: CSSProperties = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "26px",
};

const panelWrapStyle: CSSProperties = {
  marginTop: "24px",
};

const panelShellStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  background: "rgba(9, 14, 27, 0.74)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
};

const panelHeaderStyle: CSSProperties = {
  marginBottom: "18px",
  paddingBottom: "16px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const panelTagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(201, 168, 76, 0.12)",
  color: "#f1d28c",
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const panelBodyStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: "16px",
  minHeight: "320px",
};

const navigation = [
  {
    key: "contracts" as const,
    label: "Open Contracts",
    title: "Open Contracts",
    subtitle: "Live Pacifica perpetual exposure and position inventory.",
    color: "gold" as const,
    panel: <PositionsTable />,
  },
  {
    key: "reports" as const,
    label: "Intelligence Reports",
    title: "Intelligence Reports",
    subtitle: "Polymarket momentum, sentiment drift, and signal pressure.",
    color: "dark" as const,
    panel: <MarketSignals />,
  },
  {
    key: "bet" as const,
    label: "The Bet",
    title: "The Bet",
    subtitle: "Hedge suggestions when prediction odds start to move.",
    color: "red" as const,
    panel: <HedgeSuggestion />,
  },
  {
    key: "board" as const,
    label: "Garrison Board",
    title: "Garrison Board",
    subtitle: "Leaderboard view for top Pacifica operators and performance.",
    color: "gray" as const,
    panel: <TraderLeaderboard />,
  },
] satisfies Array<{
  key: PanelKey;
  label: string;
  title: string;
  subtitle: string;
  color: "gold" | "dark" | "red" | "gray";
  panel: ReactNode;
}>;

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelKey>("contracts");
  const currentPanel =
    navigation.find((item) => item.key === activePanel) ?? navigation[0];

  return (
    <div style={frameStyle}>
      <section style={heroStyle}>
        <div style={heroTopStyle}>
          <div style={{ maxWidth: "680px" }}>
            <span style={eyebrowStyle}>Pacifica Dispatch</span>
            <h1 style={{ marginTop: 0, marginBottom: "10px", fontSize: "2.5rem" }}>
              Opipolix Pacifica
            </h1>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
              A trading desk for Pacifica perps, Polymarket signal shifts, and
              fast hedge calls when the tape starts whispering.
            </p>
          </div>

          <div style={statStripStyle}>
            <div style={statCardStyle}>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Venue</div>
              <strong style={{ color: "#f8fafc", fontSize: "1.1rem" }}>Pacifica</strong>
            </div>
            <div style={statCardStyle}>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Signals</div>
              <strong style={{ color: "#f8fafc", fontSize: "1.1rem" }}>Polymarket</strong>
            </div>
            <div style={statCardStyle}>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Mode</div>
              <strong style={{ color: "#f8fafc", fontSize: "1.1rem" }}>Hedge Engine</strong>
            </div>
          </div>
        </div>

        <nav style={capRailStyle} aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <PeakyCap
              key={item.key}
              size={70}
              color={item.color}
              active={item.key === activePanel}
              label={item.label}
              onClick={() => setActivePanel(item.key)}
            />
          ))}
        </nav>
      </section>

      <section style={panelWrapStyle}>
        <div style={panelShellStyle}>
          <header style={panelHeaderStyle}>
            <span style={panelTagStyle}>Active Desk</span>
            <h2 style={{ marginBottom: "8px" }}>{currentPanel.title}</h2>
            <p style={{ color: "#94a3b8", margin: 0 }}>{currentPanel.subtitle}</p>
          </header>

          <div style={panelBodyStyle}>{currentPanel.panel}</div>
        </div>
      </section>
    </div>
  );
}
