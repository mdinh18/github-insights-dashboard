export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  open_issues_count: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // unix timestamp
}

export interface CommitActivityWeek {
  total: number;
  week: number; // unix timestamp, start of week
  days: number[]; // commits per day, Sun–Sat
}