const leaderboard = [
  { trader: "Pacifica Alpha", pnl: "$12.4k", winRate: "67%", strength: 84 },
  { trader: "Market Neutral", pnl: "$9.8k", winRate: "62%", strength: 69 },
  { trader: "Shelby Desk", pnl: "$8.1k", winRate: "59%", strength: 58 },
];

export default function TraderLeaderboard() {
  return (
    <section className="desk-panel desk-panel--gray">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Pacifica Ranking</span>
        <h3>Garrison Board</h3>
        <p>Top operators, win rates, and the desks holding composure in volatile tape.</p>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <article key={entry.trader} className="leaderboard-row">
            <div className="leaderboard-row__meta">
              <span className="leaderboard-row__rank">0{index + 1}</span>
              <div>
                <strong>{entry.trader}</strong>
                <span>{entry.pnl} PnL</span>
              </div>
            </div>

            <div className="leaderboard-row__score">
              <span>{entry.winRate} WR</span>
              <div className="leaderboard-row__bar">
                <div style={{ width: `${entry.strength}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
