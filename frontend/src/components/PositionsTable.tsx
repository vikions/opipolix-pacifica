import type { PacificaMarketSnapshot } from "../api/dashboard";

interface PositionsTableProps {
  markets: PacificaMarketSnapshot[];
  summary?: {
    count: number;
    total_volume_24h: number;
    total_open_interest: number;
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

function formatPct(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "n/a";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

export default function PositionsTable({
  markets,
  summary,
  loading,
  error,
}: PositionsTableProps) {
  const tightestSpread = markets
    .map((market) => market.spread_bps ?? Number.POSITIVE_INFINITY)
    .reduce((best, current) => Math.min(best, current), Number.POSITIVE_INFINITY);

  return (
    <section className="desk-panel desk-panel--gold">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Pacifica Live Tape</span>
        <h3>Open Contracts</h3>
        <p>Top Pacifica books ranked by live activity, spread, and order-flow context.</p>
      </div>

      <div className="panel-kpi-grid">
        <article className="panel-kpi-card">
          <span>Books</span>
          <strong>{summary?.count ?? markets.length}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>24h Volume</span>
          <strong>{summary ? formatUsd(summary.total_volume_24h) : "..."}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Tightest Spread</span>
          <strong>{Number.isFinite(tightestSpread) ? `${tightestSpread.toFixed(1)} bps` : "n/a"}</strong>
        </article>
      </div>

      {error ? <p className="panel-state">{error}</p> : null}
      {loading ? <p className="panel-state">Loading Pacifica books...</p> : null}
      {!loading && !error && markets.length === 0 ? (
        <p className="panel-state">No Pacifica market snapshots available.</p>
      ) : null}

      {!loading && !error && markets.length > 0 ? (
        <div className="mini-table">
          <div className="mini-table__row mini-table__row--head mini-table__row--contracts">
            <span>Symbol</span>
            <span>Mark</span>
            <span>24h</span>
            <span>OI</span>
            <span>Spread</span>
          </div>

          {markets.map((market) => (
            <div key={market.symbol} className="mini-table__row mini-table__row--contracts">
              <span>{market.symbol}</span>
              <span>{formatUsd(market.mark_price)}</span>
              <span>{formatPct(market.price_change_24h)}</span>
              <span>{formatUsd(market.open_interest)}</span>
              <span>{Number.isFinite(market.spread_bps) ? `${market.spread_bps.toFixed(1)} bps` : "n/a"}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
