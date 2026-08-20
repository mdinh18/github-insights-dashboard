import { useState, useMemo } from "react";
import type { GitHubRepo } from "../types/github";
import RepoCard from "./RepoCard";

type SortKey = "updated" | "stars" | "name";

interface RepoListProps {
  repos: GitHubRepo[];
  onViewActivity: (owner: string, repoName: string) => void;
}

export default function RepoList({ repos, onViewActivity }: RepoListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updated");

  const sortedRepos = useMemo(() => {
    const copy = [...repos];
    switch (sortKey) {
      case "stars":
        return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "updated":
      default:
        return copy.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  }, [repos, sortKey]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Repositories ({repos.length})</h2>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="bg-slate-800 rounded px-2 py-1 text-sm"
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div className="grid gap-3">
        {sortedRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} onViewActivity={onViewActivity} />
        ))}
      </div>
    </div>
  );
}