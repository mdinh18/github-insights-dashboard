import { useState } from "react";
import type { FormEvent } from "react";

interface SearchBarProps {
  onSearch: (username: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto mt-10">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a GitHub username..."
        className="flex-1 px-3 py-2 bg-slate-800 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-medium">
        Search
      </button>
    </form>
  );
}