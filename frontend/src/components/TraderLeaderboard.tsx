import type { PacificaMarketSnapshot } from "../api/dashboard";

interface TraderLeaderboardProps {
  markets: PacificaMarketSnapshot[];
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

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function TraderLeaderboard({
  markets,
  loading,
  error,
}: TraderLeaderboardProps) {
  const sortedMarkets = markets.slice().sort((a, b) => b.volume_24h - a.volume_24h);
  const maxVolume = sortedMarkets[0]?.volume_24h || 1;
  const totalVolume = sortedMarkets.reduce((sum, market) => sum + market.volume_24h, 0);

  const leaderboard = sortedMarkets.slice(0, 3).map((market) => {
    const strength = Math.max(
      10,
      Math.min(100, Math.round((market.volume_24h / Math.max(maxVolume, 1)) * 100))
    );

    return {
      trader: market.symbol,
      pnl: formatUsd(market.volume_24h),
      volumeShare: totalVolume > 0 ? (market.volume_24h / totalVolume) * 100 : 0,
      strength,
    };
  });

  return (
    <section className="desk-panel desk-panel--gray">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Pacifica Ranking</span>
        <h3>Garrison Board</h3>
        <p>Top Pacifica books ranked by live activity and relative tape strength.</p>
      </div>

      {error ? <p className="panel-state">{error}</p> : null}
      {loading ? <p className="panel-state">Loading Pacifica leaderboard...</p> : null}
      {!loading && !error && leaderboard.length === 0 ? (
        <p className="panel-state">No Pacifica leaderboard data available.</p>
      ) : null}

      {!loading && !error && leaderboard.length > 0 ? (
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <article key={entry.trader} className="leaderboard-row">
              <div className="leaderboard-row__meta">
                <span className="leaderboard-row__rank">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{entry.trader}</strong>
                  <span>{entry.pnl} 24h Vol</span>
                </div>
              </div>

              <div className="leaderboard-row__score">
                <span>{formatPct(entry.volumeShare)} Vol Share</span>
                <div className="leaderboard-row__bar">
                  <div style={{ width: `${entry.strength}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}