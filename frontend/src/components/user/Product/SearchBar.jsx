// src/components/SearchBar.jsx
import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="w-60 relative">
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <input
          type="text"
          placeholder="Search Products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none px-2 text-gray-700 w-[180px] md:w-[200px]"
        />
        <button type="submit" aria-label="search"><Search className="text-gray-500 w-4 h-4" /></button>
      </form>
      {value && (
        <button onClick={onClear} className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">×</button>
      )}
    </div>
  );
}
