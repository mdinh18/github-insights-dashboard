import { useState } from "react";
import type { FormEvent } from "react";

interface TokenInputProps {
  onSubmit: (token: string) => void;
}

export default function TokenInput({ onSubmit }: TokenInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-slate-900 rounded-lg">
      <label className="block text-sm text-slate-400 mb-2">
        GitHub Personal Access Token
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ghp_..."
        className="w-full px-3 py-2 bg-slate-800 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-slate-500 mt-2">
        Needs only <code>public_repo</code> read scope. Never share this token — it's stored only in your browser's localStorage.
      </p>
      <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-medium">
        Connect
      </button>
    </form>
  );
}