import { useEffect, useState } from "react";

import { fetchMarkets, fetchSignals } from "../api/polymarket";

export function usePolymarket() {
  const [markets, setMarkets] = useState<unknown[]>([]);
  const [signals, setSignals] = useState<unknown[]>([]);

  useEffect(() => {
    void (async () => {
      setMarkets(await fetchMarkets());
      setSignals(await fetchSignals());
    })();
  }, []);

  return { markets, signals };
}
