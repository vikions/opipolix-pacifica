import type { HedgeSignal } from "../api/dashboard";

interface HedgeSuggestionProps {
  signals: HedgeSignal[];
  summary?: {
    count: number;
    immediate: number;
    assets: string[];
  };
  loading: boolean;
  error: string | null;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HedgeSuggestion({
  signals,
  summary,
  loading,
  error,
}: HedgeSuggestionProps) {
  const primary = signals[0] ?? null;

  return (
    <section className="desk-panel desk-panel--red">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Hedge Trigger</span>
        <h3>The Bet</h3>
        <p>Live hedge suggestions generated from Polymarket repricing and Pacifica context.</p>
      </div>

      <div className="panel-kpi-grid">
        <article className="panel-kpi-card">
          <span>Signals</span>
          <strong>{summary?.count ?? signals.length}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Immediate</span>
          <strong>{summary?.immediate ?? 0}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Assets</span>
          <strong>{summary?.assets?.join(", ") || "n/a"}</strong>
        </article>
      </div>

      {error ? <p className="panel-state">{error}</p> : null}
      {loading ? <p className="panel-state">Loading hedge suggestions...</p> : null}
      {!loading && !error && !primary ? (
        <p className="panel-state">No active hedge suggestions right now.</p>
      ) : null}

      {!loading && !error && primary ? (
        <article className="bet-card">
          <div className="bet-card__header">
            <div>
              <span className="bet-card__eyebrow">Primary Hedge</span>
              <strong>
                {primary.suggested_side.toUpperCase()} {primary.pacifica_symbol}
              </strong>
            </div>
            <span className="bet-card__badge">{primary.urgency}</span>
          </div>

          <p>{primary.rationale}</p>

          <div className="bet-card__grid">
            <div>
              <span>Size</span>
              <strong>{formatUsd(primary.suggested_notional_usd)}</strong>
            </div>
            <div>
              <span>Signal Type</span>
              <strong>{primary.signal_type}</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{primary.confidence.toFixed(2)}</strong>
            </div>
          </div>
        </article>
      ) : null}
    </section>
  );
}