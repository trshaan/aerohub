"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  // READ: load favorites from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const favs = JSON.parse(localStorage.getItem("aerohub_favorites") || "[]");
    setFavorites(favs);
  }, []);

  // UPDATE: edit the note on a favorite
  const updateNote = (iata, newNote) => {
    const updated = favorites.map((f) =>
      f.iata === iata ? { ...f, note: newNote } : f
    );
    setFavorites(updated);
    localStorage.setItem("aerohub_favorites", JSON.stringify(updated));
  };

  // DELETE: remove a favorite from the list
  const removeFavorite = (iata) => {
    const updated = favorites.filter((f) => f.iata !== iata);
    setFavorites(updated);
    localStorage.setItem("aerohub_favorites", JSON.stringify(updated));
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAV */}
      <nav className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-orange-500 text-2xl">A</span>
          <span className="font-bold tracking-widest text-lg">AEROHUB</span>
        </Link>
        <Link href="/" className="text-xs font-mono text-white/40 tracking-wider hover:text-orange-500 transition">
          BACK TO HUB
        </Link>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-6">
          MY HUB
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          My favorite airports
        </h1>
        <p className="text-white/60 text-lg">
          {favorites.length === 0
            ? "No favorites yet. Find an airport and tap the star."
            : `You've saved ${favorites.length} airport${favorites.length === 1 ? "" : "s"}.`}
        </p>
      </section>

      {/* FAVORITES LIST */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {favorites.length === 0 ? (
          <div className="border border-white/10 rounded-lg p-12 text-center">
            <p className="text-white/40 mb-6">Nothing here yet.</p>
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-full transition"
            >
              Browse airports
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((f) => (
              <div
                key={f.iata}
                className="border border-white/10 rounded-lg p-6 bg-white/[0.02]"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <Link
                    href={`/airport/${f.iata}`}
                    className="flex items-baseline gap-4 hover:opacity-80 transition"
                  >
                    <span className="text-3xl font-bold text-orange-500 font-mono">
                      {f.iata}
                    </span>
                    <div>
                      <div className="font-semibold text-lg">{f.name}</div>
                      <div className="text-sm text-white/50">
                        {f.city}, {f.country}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFavorite(f.iata)}
                    className="text-white/40 hover:text-red-400 text-sm font-mono tracking-wider transition"
                  >
                    REMOVE
                  </button>
                </div>

                {/* UPDATE: editable note */}
                <textarea
                  value={f.note}
                  onChange={(e) => updateNote(f.iata, e.target.value)}
                  placeholder="Add a personal note... (e.g. 'visited in 2024', 'dream destination')"
                  rows={2}
                  className="w-full mt-4 bg-black border border-white/10 focus:border-orange-500/60 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none transition text-sm resize-none"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}