"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type ActivityLog } from "@/lib/types";
import { fetchActivity } from "@/lib/api";

interface DataContextValue {
  activity: ActivityLog | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue>({
  activity: null,
  loading: true,
  error: null,
  lastUpdated: null,
  refresh: async () => {},
});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<ActivityLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchActivity();
      setActivity(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load activity data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Auto-poll every 10s
  useEffect(() => {
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [load]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await load();
  }, [load]);

  return (
    <DataContext.Provider value={{ activity, loading, error, lastUpdated, refresh }}>
      {children}
    </DataContext.Provider>
  );
}
