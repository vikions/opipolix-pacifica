import { useState, type ReactNode } from "react";

import tommySilhouette from "../assets/characters/tommy-silhouette.png";
import { useDashboard } from "../hooks/useDashboard";
import HedgeSuggestion from "./HedgeSuggestion";
import MarketSignals from "./MarketSignals";
import PeakyCap from "./PeakyCap";
import PositionsTable from "./PositionsTable";
import TraderLeaderboard from "./TraderLeaderboard";

type PanelKey = "contracts" | "reports" | "bet" | "board";
type PanelColor = "gold" | "dark" | "red" | "gray";

const dossier = [
  {
    label: "Signal Source",
    value: "Polymarket Drift",
    note: "Event repricing, conviction changes, and momentum in probabilities.",
  },
  {
    label: "Execution Venue",
    value: "Pacifica Perps",
    note: "Directional hedges routed into fast perpetual positioning.",
  },
  {
    label: "Engine",
    value: "Cross-Market Map",
    note: "Probability shift, current exposure, and asset linkage scored together.",
  },
  {
    label: "Output",
    value: "Actionable Hedge",
    note: "Side, size, urgency, and confidence in one readable decision.",
  },
] as const;

const navigation = [
  {
    key: "contracts" as const,
    label: "Open Contracts",
    title: "Open Contracts",
    subtitle: "Live Pacifica perpetual exposure and position inventory.",
    color: "gold" as const,
  },
  {
    key: "reports" as const,
    label: "Intelligence Reports",
    title: "Intelligence Reports",
    subtitle: "Polymarket momentum, sentiment drift, and signal pressure.",
    color: "dark" as const,
  },
  {
    key: "bet" as const,
    label: "The Bet",
    title: "The Bet",
    subtitle: "Hedge suggestions when prediction odds start to move.",
    color: "red" as const,
  },
  {
    key: "board" as const,
    label: "Garrison Board",
    title: "Garrison Board",
    subtitle: "Leaderboard view for top Pacifica operators and performance.",
    color: "gray" as const,
  },
] satisfies Array<{
  key: PanelKey;
  label: string;
  title: string;
  subtitle: string;
  color: PanelColor;
}>;

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelKey>("contracts");
  const { data, loading, error } = useDashboard();

  const currentPanel =
    navigation.find((item) => item.key === activePanel) ?? navigation[0];
  const marqueeText =
    "POLYMARKET FLOW // PACIFICA PERPS // EVENT DRIFT // HEDGE DESK // ";

  const panelContent: Record<PanelKey, ReactNode> = {
    contracts: (
      <PositionsTable
        markets={data?.pacifica.markets ?? []}
        summary={data?.pacifica.summary}
        loading={loading}
        error={error}
      />
    ),
    reports: (
      <MarketSignals
        markets={data?.polymarket.markets ?? []}
        summary={data?.polymarket.summary}
        loading={loading}
        error={error}
      />
    ),
    bet: (
      <HedgeSuggestion
        signals={data?.signals.hedges ?? []}
        summary={data?.signals.summary}
        loading={loading}
        error={error}
      />
    ),
    board: (
      <TraderLeaderboard
        markets={data?.pacifica.markets ?? []}
        loading={loading}
        error={error}
      />
    ),
  };

  return (
    <div className="dashboard-shell">
      <section className="hero-shell">
        <div className="hero-shell__ghost-title" aria-hidden="true">
          OPIPOLIX
        </div>
        <div className="hero-shell__grain" aria-hidden="true" />
        <div className="hero-shell__ray hero-shell__ray--left" aria-hidden="true" />
        <div className="hero-shell__ray hero-shell__ray--right" aria-hidden="true" />
        <div className="hero-shell__smoke hero-shell__smoke--one" aria-hidden="true" />
        <div className="hero-shell__smoke hero-shell__smoke--two" aria-hidden="true" />

        <div className="dashboard-marquee" aria-hidden="true">
          <div className="dashboard-marquee__track">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>

        <div className="dashboard-hero">
          <div className="dashboard-copy">
            <span className="dashboard-eyebrow">Signal Desk</span>
            <p className="dashboard-kicker">
              Event probabilities, perp exposure, and hedge timing
            </p>
            <h1>
              <span>Odds move.</span>
              <strong>We hedge first.</strong>
            </h1>
            <p className="dashboard-copy__text">
              Opipolix is a cross-market trading desk that watches Polymarket
              conviction shifts, reads Pacifica perpetual positioning, and turns
              both into fast hedge ideas with clear direction, sizing, and
              urgency.
            </p>

            <div className="dashboard-dossier">
              {dossier.map((item) => (
                <article key={item.label} className="dashboard-dossier__card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>

            <p className="dashboard-copy__footnote">
              Detect the move. Map the asset. Check the book. Price the hedge.
            </p>

            {data?.generated_at ? (
              <p className="dashboard-copy__footnote dashboard-copy__footnote--muted">
                Live snapshot {new Date(data.generated_at).toLocaleString()}
              </p>
            ) : null}
          </div>

          <div className="dashboard-figure">
            <div className="dashboard-figure__card">
              <span className="dashboard-figure__eyebrow">Night Desk</span>
              <strong>Probability Repricing Scanner</strong>
              <p>
                When event odds break away from the prior range, the engine checks
                existing perp exposure before proposing the next posture.
              </p>
            </div>

            <img
              src={tommySilhouette}
              alt="Thomas Shelby silhouette"
              className="dashboard-figure__image"
            />
            <div className="dashboard-figure__shadow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="cap-stage">
        <div className="cap-stage__heading">
          <span>Choose the room</span>
          <p>One flow: positions, event drift, hedge logic, operator context.</p>
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
            <span>Current layer</span>
            <strong>{currentPanel.label}</strong>
          </div>
        </div>

        <div key={currentPanel.key} className="dashboard-panel-frame dashboard-panel-frame--animate">
          {panelContent[currentPanel.key]}
        </div>
      </section>
    </div>
  );
}
