const positions = [
  { market: "BTC-PERP", side: "Long", size: "1.25 BTC", entry: "$68,250" },
  { market: "ETH-PERP", side: "Short", size: "8.00 ETH", entry: "$3,520" },
  { market: "SOL-PERP", side: "Long", size: "240 SOL", entry: "$156.40" },
];

export default function PositionsTable() {
  return (
    <section className="desk-panel desk-panel--gold">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Pacifica Positions</span>
        <h3>Open Contracts</h3>
        <p>Current perpetual exposure with quick reads on size, side, and entry.</p>
      </div>

      <div className="panel-kpi-grid">
        <article className="panel-kpi-card">
          <span>Notional</span>
          <strong>$184.2k</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Net Delta</span>
          <strong>+0.68</strong>
        </article>
        <article className="panel-kpi-card">
          <span>Leverage</span>
          <strong>3.4x</strong>
        </article>
      </div>

      <div className="mini-table">
        <div className="mini-table__row mini-table__row--head">
          <span>Market</span>
          <span>Side</span>
          <span>Size</span>
          <span>Entry</span>
        </div>

        {positions.map((position) => (
          <div key={position.market} className="mini-table__row">
            <span>{position.market}</span>
            <span>{position.side}</span>
            <span>{position.size}</span>
            <span>{position.entry}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
