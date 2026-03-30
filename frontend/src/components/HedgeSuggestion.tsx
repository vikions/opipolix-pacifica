export default function HedgeSuggestion() {
  return (
    <section className="desk-panel desk-panel--red">
      <div className="desk-panel__lead">
        <span className="desk-panel__eyebrow">Hedge Trigger</span>
        <h3>The Bet</h3>
        <p>When odds jump, the desk proposes a matching perp posture with quick rationale.</p>
      </div>

      <article className="bet-card">
        <div className="bet-card__header">
          <div>
            <span className="bet-card__eyebrow">Primary Hedge</span>
            <strong>Open BTC-PERP Long</strong>
          </div>
          <span className="bet-card__badge">+6 pts shift</span>
        </div>

        <p>
          Polymarket buyers are leaning harder into upside. The engine suggests
          a measured BTC perpetual long to mirror the probability expansion.
        </p>

        <div className="bet-card__grid">
          <div>
            <span>Size</span>
            <strong>0.45 BTC</strong>
          </div>
          <div>
            <span>Bias</span>
            <strong>Directional</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>0.74</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
