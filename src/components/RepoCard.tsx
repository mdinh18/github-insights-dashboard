import type { GitHubRepo } from "../types/github";

interface RepoCardProps {
  repo: GitHubRepo;
  onViewActivity: (owner: string, repoName: string) => void;
}

export default function RepoCard({ repo, onViewActivity }: RepoCardProps) {
  const [owner] = repo.full_name.split("/");

  return (
    <div className="block p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        <h3 className="font-medium text-blue-400">{repo.name}</h3>
        {repo.description && (
          <p className="text-sm text-slate-400 mt-1">{repo.description}</p>
        )}
      </a>
      <div className="flex gap-4 mt-2 text-xs text-slate-500 items-center">
        {repo.language && <span>{repo.language}</span>}
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
        <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
        <button
            onClick={() => {
                console.log("Clicked:", owner, repo.name);
                onViewActivity(owner, repo.name);
            }}
            className="text-blue-400 hover:underline ml-auto"
            >
            View activity
        </button>
      </div>
    </div>
  );
}