import { useEffect, useState } from "react";

import { fetchDashboardOverview, type DashboardOverview } from "../api/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const overview = await fetchDashboardOverview();
        if (!cancelled) {
          setData(overview);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError("Live feed unavailable. Check that the backend is running.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
