import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GitHubRepo } from "../types/github";

interface LanguageChartProps {
  repos: GitHubRepo[];
}

const COLORS = [
  "#3b82f6", "#22c55e", "#eab308", "#ef4444",
  "#a855f7", "#06b6d4", "#f97316", "#ec4899",
];

export default function LanguageChart({ repos }: LanguageChartProps) {
  const languageData = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const repo of repos) {
      if (!repo.language) continue; // skip repos with no detected language
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [repos]);

  if (languageData.length === 0) {
    return (
      <p className="text-center text-slate-500 mt-8">
        No language data available.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-slate-900 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Language Breakdown</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={languageData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => entry.name}
          >
            {languageData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}