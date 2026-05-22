"use client";

import { useState, useEffect } from "react";

export default function FavoriteButton({ airport }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount, check localStorage to see if this airport is already favorited
  useEffect(() => {
    setMounted(true);
    const favs = JSON.parse(localStorage.getItem("aerohub_favorites") || "[]");
    setIsFavorite(favs.some((f) => f.iata === airport.iata));
  }, [airport.iata]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("aerohub_favorites") || "[]");

    if (isFavorite) {
      // DELETE: remove from favorites
      const updated = favs.filter((f) => f.iata !== airport.iata);
      localStorage.setItem("aerohub_favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // CREATE: add to favorites
      const newFav = {
        iata: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        note: "",
        addedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "aerohub_favorites",
        JSON.stringify([...favs, newFav])
      );
      setIsFavorite(true);
    }
  };

  // Don't render anything until mounted (avoids SSR mismatch)
  if (!mounted) return null;

  return (
    <button
      onClick={toggleFavorite}
      className={
        isFavorite
          ? "inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-full transition ml-3"
          : "inline-block border border-white/20 hover:border-orange-500/60 text-white font-bold px-6 py-3 rounded-full transition ml-3"
      }
    >
      {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
    </button>
  );
}
