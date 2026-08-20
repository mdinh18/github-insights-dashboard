import { useState, useEffect } from "react";
import { GitHubApiError } from "../services/githubApi";
import type { RateLimitInfo } from "../types/github";

interface UseGitHubApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  rateLimit: RateLimitInfo | null;
}

export function useGitHubApi<T>(
  fetchFn: (() => Promise<{ data: T; rateLimit: RateLimitInfo }>) | null
): UseGitHubApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  useEffect(() => {
    if (!fetchFn) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setRateLimit(res.rateLimit);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof GitHubApiError ? err.message : "Something went wrong";
        setError(message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchFn]);

  return { data, loading, error, rateLimit };
}