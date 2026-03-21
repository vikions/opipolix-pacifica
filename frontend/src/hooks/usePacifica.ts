import { useEffect, useState } from "react";

import { fetchLeaderboard, fetchPositions } from "../api/pacifica";

export function usePacifica() {
  const [positions, setPositions] = useState<unknown[]>([]);
  const [leaderboard, setLeaderboard] = useState<unknown[]>([]);

  useEffect(() => {
    void (async () => {
      setPositions(await fetchPositions());
      setLeaderboard(await fetchLeaderboard());
    })();
  }, []);

  return { positions, leaderboard };
}
