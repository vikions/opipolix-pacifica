const reports = [
  {
    market: "BTC > 70k This Week",
    probability: "58%",
    move: "+6.7 pts",
    conviction: "High",
  },
  {
    market: "ETH > 3.6k This Month",
    probability: "39%",
    move: "-5.3 pts",
    conviction: "Medium",
  },
  {
    market: "SOL Outperform BTC This Week",
    probability: "64%",
    move: "+9.4 pts",
    conviction: "High",
  },
];

export default function MarketSignals() {
  return (
    <section className="desk-panel desk-panel--dark">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Polymarket Flow</span>
        <h3>Intelligence Reports</h3>
        <p>Prediction-market pressure points and the contracts showing the fastest drift.</p>
      </div>

      <div className="signal-list">
        {reports.map((report) => (
          <article key={report.market} className="signal-card">
            <div className="signal-card__top">
              <h4>{report.market}</h4>
              <span className="signal-chip">{report.conviction}</span>
            </div>

            <div className="signal-card__metrics">
              <div>
                <span>Probability</span>
                <strong>{report.probability}</strong>
              </div>
              <div>
                <span>24h Move</span>
                <strong>{report.move}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
