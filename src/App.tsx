import { useState, useCallback } from "react";
import { useGitHubToken } from "./hooks/useGitHubToken";
import { useGitHubApi } from "./hooks/useGitHubApi";
import TokenInput from "./components/TokenInput";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import CommitActivityChart from "./components/CommitActivityChart";
import { fetchUser, fetchUserRepos } from "./services/githubApi";

function App() {
  const { token, setToken } = useGitHubToken();
  const [username, setUsername] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<{ owner: string; repoName: string } | null>(null);

  const fetchUserFn = useCallback(() => {
    return fetchUser(username!, token);
  }, [username, token]);

  const fetchReposFn = useCallback(() => {
    return fetchUserRepos(username!, token);
  }, [username, token]);

  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useGitHubApi(token && username ? fetchUserFn : null);

  const {
    data: repos,
    loading: reposLoading,
    error: reposError,
  } = useGitHubApi(token && username ? fetchReposFn : null);

  function handleViewActivity(owner: string, repoName: string) {
    setSelectedRepo({ owner, repoName });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {!token ? (
        <TokenInput onSubmit={setToken} />
      ) : (
        <>
          <SearchBar onSearch={setUsername} />
          {userLoading && (
            <p className="text-center mt-8 text-slate-400">Loading...</p>
          )}
          {userError && (
            <p className="text-center mt-8 text-red-400">{userError}</p>
          )}
          {user && !userLoading && <ProfileCard user={user} />}
          {reposError && (
            <p className="text-center mt-4 text-red-400">{reposError}</p>
          )}
          {repos && !reposLoading && (
            <RepoList repos={repos} onViewActivity={handleViewActivity} />
          )}
          {repos && !reposLoading && <LanguageChart repos={repos} />}
          {selectedRepo && (
            <CommitActivityChart
              owner={selectedRepo.owner}
              repoName={selectedRepo.repoName}
              token={token}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;