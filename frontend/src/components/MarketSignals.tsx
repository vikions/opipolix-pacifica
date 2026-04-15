import type { PolymarketMarket } from "../api/dashboard";

interface MarketSignalsProps {
  markets: PolymarketMarket[];
  summary?: {
    count: number;
    total_volume_24h: number;
    total_liquidity: number;
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

function formatPts(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "n/a";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(1)} pts`;
}

function getMoveLabel(oneDay: number | null | undefined, oneWeek: number | null | undefined) {
  if (oneDay != null) {
    return "1d Move";
  }
  if (oneWeek != null) {
    return "1w Move";
  }
  return "Move";
}

export default function MarketSignals({
  markets,
  summary,
  loading,
  error,
}: MarketSignalsProps) {
  return (
    <section className="desk-panel desk-panel--dark">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Polymarket Flow</span>
        <h3>Intelligence Reports</h3>
        <p>Live event markets filtered for Pacifica-linked assets and repricing candidates.</p>
      </div>

      <div className="panel-kpi-grid">
        <article className="panel-kpi-card">
          <span>Signals</span>
          <strong>{summary?.count ?? markets.length}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>24h Volume</span>
          <strong>{summary ? formatUsd(summary.total_volume_24h) : "..."}</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Liquidity</span>
          <strong>{summary ? formatUsd(summary.total_liquidity) : "..."}</strong>
        </article>
      </div>

      {error ? (
        <p className="panel-state">{error}</p>
      ) : loading ? (
        <p className="panel-state">Loading Polymarket reports...</p>
      ) : markets.length === 0 ? (
        <p className="panel-state">No directly mappable live crypto markets were found right now.</p>
      ) : null}

      {!loading && !error && markets.length > 0 ? (
        <div className="signal-list">
          {markets.map((market) => (
            <article key={market.id} className="signal-card">
              <div className="signal-card__top">
                <h4>{market.question}</h4>
                <span className="signal-chip">{market.related_asset}</span>
              </div>

              <div className="signal-card__metrics">
                <div>
                  <span>Probability</span>
                  <strong>{(market.probability * 100).toFixed(1)}%</strong>
                </div>
                <div>
                  <span>{getMoveLabel(market.one_day_price_change, market.one_week_price_change)}</span>
                  <strong>{formatPts(market.one_day_price_change ?? market.one_week_price_change)}</strong>
                </div>
                <div>
                  <span>24h Vol</span>
                  <strong>{formatUsd(market.volume_24h)}</strong>
                </div>
                <div>
                  <span>Liquidity</span>
                  <strong>{formatUsd(market.liquidity)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
