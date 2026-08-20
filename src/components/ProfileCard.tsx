import type { GitHubUser } from "../types/github";

interface ProfileCardProps {
  user: GitHubUser;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-slate-900 rounded-lg flex gap-4">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-20 h-20 rounded-full"
      />
      <div>
        <h2 className="text-xl font-semibold">{user.name ?? user.login}</h2>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm hover:underline"
        >
          @{user.login}
        </a>
        {user.bio && (
          <p className="text-slate-400 text-sm mt-2">{user.bio}</p>
        )}
        <div className="flex gap-4 mt-3 text-sm text-slate-300">
          <span>{user.public_repos} repos</span>
          <span>{user.followers} followers</span>
          <span>{user.following} following</span>
        </div>
      </div>
    </div>
  );
}