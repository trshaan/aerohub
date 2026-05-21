"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import airports from "../data/airports.json";
import airlines from "../data/airlines.json";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Filter results based on the query. useMemo caches the result so it doesn't recompute on every render.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return { airports: [], airlines: [] };

    const matchedAirports = airports
      .filter(
        (a) =>
          a.iata.toLowerCase().includes(q) ||
          a.icao?.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.city?.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedAirlines = airlines
      .filter(
        (a) =>
          a.iata?.toLowerCase().includes(q) ||
          a.icao?.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
      )
      .slice(0, 5);

    return { airports: matchedAirports, airlines: matchedAirlines };
  }, [query]);

  const hasResults = results.airports.length > 0 || results.airlines.length > 0;
  const showDropdown = isFocused && query.length >= 2;

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search airports, airlines, or codes (e.g. JFK, Emirates, Tokyo)"
          className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/60 focus:bg-white/[0.05] rounded-full px-6 py-4 text-white placeholder-white/30 outline-none transition font-mono text-sm tracking-wide"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500 text-lg">
          ⌕
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-black border border-white/10 rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {!hasResults && (
            <div className="px-6 py-8 text-center text-white/40 text-sm">
              No matches for{" "}
              <span className="text-white font-mono">"{query}"</span>
            </div>
          )}

          {results.airports.length > 0 && (
            <div>
              <div className="px-6 pt-4 pb-2 text-orange-500 text-xs font-mono tracking-[0.3em]">
                — AIRPORTS
              </div>
              {results.airports.map((a) => (
                <Link
                  key={a.iata}
                  href={`/airport/${a.iata}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-orange-500/5 transition group"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-orange-500 transition">
                      {a.name}
                    </div>
                    <div className="text-xs text-white/40">
                      {a.city}, {a.country}
                    </div>
                  </div>
                  <div className="font-mono text-orange-500 font-bold text-lg">
                    {a.iata}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.airlines.length > 0 && (
            <div className="border-t border-white/5">
              <div className="px-6 pt-4 pb-2 text-orange-500 text-xs font-mono tracking-[0.3em]">
                — AIRLINES
              </div>
              {results.airlines.map((a) => (
                <Link
                  key={a.iata + a.id}
                  href={`/airline/${a.iata}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-orange-500/5 transition group"
                >
                  <div>
                    <div className="font-semibold text-white group-hover:text-orange-500 transition">
                      {a.name}
                    </div>
                    <div className="text-xs text-white/40">{a.country}</div>
                  </div>
                  <div className="font-mono text-orange-500 font-bold text-lg">
                    {a.iata}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}