import type { GitHubUser, GitHubRepo, RateLimitInfo, CommitActivityWeek } from "../types/github";
const BASE_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "GitHubApiError";
  }
}

async function request<T>(endpoint: string, token: string): Promise<{ data: T; rateLimit: RateLimitInfo }> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const rateLimit: RateLimitInfo = {
    limit: Number(res.headers.get("x-ratelimit-limit")),
    remaining: Number(res.headers.get("x-ratelimit-remaining")),
    reset: Number(res.headers.get("x-ratelimit-reset")),
  };

  if (!res.ok) {
    if (res.status === 404) {
      throw new GitHubApiError("User not found", 404);
    }
    if (res.status === 401) {
      throw new GitHubApiError("Invalid or expired token", 401);
    }
    if (res.status === 403 && rateLimit.remaining === 0) {
      throw new GitHubApiError("Rate limit exceeded", 403);
    }
    throw new GitHubApiError(`GitHub API error: ${res.status}`, res.status);
  }

  const data = (await res.json()) as T;
  return { data, rateLimit };
}

export function fetchUser(username: string, token: string) {
  return request<GitHubUser>(`/users/${username}`, token);
}

export function fetchUserRepos(username: string, token: string) {
  return request<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`, token);
}

export type CommitActivityResult =
  | { status: "pending" }
  | { status: "ready"; data: CommitActivityWeek[]; rateLimit: RateLimitInfo };

export async function fetchCommitActivity(
  owner: string,
  repoName: string,
  token: string
): Promise<CommitActivityResult> {
  const res = await fetch(`${BASE_URL}/repos/${owner}/${repoName}/stats/commit_activity`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const rateLimit: RateLimitInfo = {
    limit: Number(res.headers.get("x-ratelimit-limit")),
    remaining: Number(res.headers.get("x-ratelimit-remaining")),
    reset: Number(res.headers.get("x-ratelimit-reset")),
  };

  if (res.status === 202) {
    return { status: "pending" };
  }
  if (!res.ok) {
    throw new GitHubApiError(`GitHub API error: ${res.status}`, res.status);
  }

  const data = (await res.json()) as CommitActivityWeek[];
  return { status: "ready", data, rateLimit };
}
