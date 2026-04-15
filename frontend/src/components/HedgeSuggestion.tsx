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
            <strong>Short ETH-PERP Against Event Weakness</strong>
          </div>
          <span className="bet-card__badge">Elevated</span>
        </div>

        <p>
          The ETH event market has been repricing lower while the current Pacifica
          book is still net long. The desk proposes a short ETH perpetual as a
          hedge against that fading probability regime.
        </p>

        <div className="bet-card__grid">
          <div>
            <span>Size</span>
            <strong>$26.7k</strong>
          </div>
          <div>
            <span>Signal Type</span>
            <strong>Hedge</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>0.68</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
