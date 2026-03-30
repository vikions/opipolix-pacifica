import { useState, type ReactNode } from "react";

import tommySilhouette from "../assets/characters/tommy-silhouette.png";
import HedgeSuggestion from "./HedgeSuggestion";
import MarketSignals from "./MarketSignals";
import PeakyCap from "./PeakyCap";
import PositionsTable from "./PositionsTable";
import TraderLeaderboard from "./TraderLeaderboard";

type PanelKey = "contracts" | "reports" | "bet" | "board";
type PanelColor = "gold" | "dark" | "red" | "gray";

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
  color: PanelColor;
  panel: ReactNode;
}>;

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelKey>("contracts");
  const currentPanel =
    navigation.find((item) => item.key === activePanel) ?? navigation[0];

  return (
    <div className="dashboard-shell">
      <section className="hero-shell">
        <div className="dashboard-hero">
          <div className="dashboard-copy">
            <span className="dashboard-eyebrow">Pacifica Dispatch</span>
            <h1>Opipolix Pacifica</h1>
            <p className="dashboard-copy__text">
              A trading desk for Pacifica perps, Polymarket signal shifts, and
              fast hedge calls when the tape starts whispering.
            </p>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <span>Venue</span>
                <strong>Pacifica</strong>
              </div>
              <div className="dashboard-stat-card">
                <span>Signals</span>
                <strong>Polymarket</strong>
              </div>
              <div className="dashboard-stat-card">
                <span>Mode</span>
                <strong>Hedge Engine</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-figure">
            <div className="dashboard-figure__card">
              <span className="dashboard-figure__eyebrow">Desk Mood</span>
              <strong>Tommy Mode</strong>
              <p>Quiet room. Sharp odds. No wasted motion.</p>
            </div>

            <img
              src={tommySilhouette}
              alt="Thomas Shelby silhouette"
              className="dashboard-figure__image"
            />
            <div className="dashboard-figure__shadow" aria-hidden="true" />
          </div>
        </div>

        <nav className="cap-rail" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <PeakyCap
              key={item.key}
              size={82}
              color={item.color}
              active={item.key === activePanel}
              label={item.label}
              onClick={() => setActivePanel(item.key)}
            />
          ))}
        </nav>
      </section>

      <section className={`dashboard-panel-shell theme-${currentPanel.color}`}>
        <div className="dashboard-panel-shell__header">
          <header>
            <span className="dashboard-tag">Active Desk</span>
            <h2>{currentPanel.title}</h2>
            <p>{currentPanel.subtitle}</p>
          </header>

          <div className="dashboard-panel-shell__stamp">
            <span>Selected</span>
            <strong>{currentPanel.label}</strong>
          </div>
        </div>

        <div className="dashboard-panel-frame">{currentPanel.panel}</div>
      </section>
    </div>
  );
}
