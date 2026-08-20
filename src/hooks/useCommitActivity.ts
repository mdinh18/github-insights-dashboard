import { useState, useEffect } from "react";
import { fetchCommitActivity, GitHubApiError } from "../services/githubApi";
import type { CommitActivityWeek } from "../types/github";

const MAX_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 2000;

export function useCommitActivity(owner: string | null, repoName: string | null, token: string) {
  const [data, setData] = useState<CommitActivityWeek[] | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repoName) return;

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      setStatus("pending");
      try {
        const result = await fetchCommitActivity(owner!, repoName!, token);
        if (cancelled) return;

        if (result.status === "pending") {
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            setError("GitHub is still computing stats for this repo — try again in a minute.");
            setStatus("error");
          } else {
            setTimeout(poll, POLL_INTERVAL_MS);
          }
        } else {
          setData(result.data);
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof GitHubApiError ? err.message : "Something went wrong");
        setStatus("error");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [owner, repoName, token]);

  return { data, status, error };
}