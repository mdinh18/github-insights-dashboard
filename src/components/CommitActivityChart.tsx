
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useCommitActivity } from "../hooks/useCommitActivity";

interface CommitActivityChartProps {
  owner: string;
  repoName: string;
  token: string;
}

export default function CommitActivityChart({ owner, repoName, token }: CommitActivityChartProps) {
  const { data, status, error } = useCommitActivity(owner, repoName, token);

  if (status === "pending" || status === "idle") {
    return (
      <p className="text-center mt-8 text-slate-400">
        Computing commit activity — GitHub caches this the first time, so it can take a few seconds...
      </p>
    );
  }

  if (status === "error") {
    return <p className="text-center mt-8 text-red-400">{error}</p>;
  }

  const chartData = (data ?? []).map((week) => ({
    week: new Date(week.week * 1000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    commits: week.total,
  }));

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-900 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        Commit Activity — {owner}/{repoName}
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}