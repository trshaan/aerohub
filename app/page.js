import airports from "./data/airports.json";
import airlines from "./data/airlines.json";
import routes from "./data/routes.json";
import SearchBar from "./components/SearchBar";
import Link from "next/link";

export default function Home() {
  const featuredAirports = ["JFK", "LHR", "DXB", "HND", "SIN", "LAX"]
    .map((code) => airports.find((a) => a.iata === code))
    .filter(Boolean);

  const featuredAirlines = ["EK", "SQ", "QR", "AA", "BA", "LH"]
    .map((code) => airlines.find((a) => a.iata === code))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* TOP BAR */}
      <nav className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-2xl">✈</span>
          <span className="font-bold tracking-widest text-lg">AEROHUB</span>
        </div>
        <div className="text-xs font-mono text-white/40 tracking-wider hidden md:block">
          AVGEEK CENTRAL · EST. 2026
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-6">
            — DEPARTURES BOARD
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
            Every airport.
            <br />
            Every airline.
            <br />
            <span className="italic text-orange-500">One hub.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Routes, fleets, and stats for the avgeek in all of us. Browse{" "}
            <span className="text-white font-mono">
              {airports.length.toLocaleString()}
            </span>{" "}
            airports,{" "}
            <span className="text-white font-mono">
              {airlines.length.toLocaleString()}
            </span>{" "}
            airlines, and{" "}
            <span className="text-white font-mono">
              {routes.length.toLocaleString()}
            </span>{" "}
            routes.
          </p>
          <div className="mt-2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          <Stat label="Airports" value={airports.length.toLocaleString()} />
          <Stat label="Airlines" value={airlines.length.toLocaleString()} />
          <Stat label="Routes" value={routes.length.toLocaleString()} />
          <Stat
            label="Countries"
            value={new Set(airports.map((a) => a.country)).size}
          />
        </div>
      </section>

      {/* FEATURED AIRPORTS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-3">
              — TERMINALS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Featured airports</h2>
          </div>
          <p className="text-white/40 text-sm hidden md:block">
            The world's busiest hubs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredAirports.map((a) => (
            <AirportCard key={a.iata} airport={a} />
          ))}
        </div>
      </section>

      {/* FEATURED AIRLINES */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-3">
              — CARRIERS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Featured airlines</h2>
          </div>
          <p className="text-white/40 text-sm hidden md:block">
            Iconic carriers worldwide.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredAirlines.map((a) => (
            <AirlineCard key={a.iata} airline={a} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-white/40 text-sm">
        <p className="font-mono tracking-wider">
          BUILT WITH <span className="text-orange-500">✈</span> BY AN AVGEEK IN
          TRAINING
        </p>
        <p className="mt-2 text-xs">Data: OurAirports & OpenFlights</p>
      </footer>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-black p-8 text-center md:text-left">
      <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
        {value}
      </div>
      <div className="text-white/50 text-xs font-mono tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

function AirportCard({ airport }) {
  return (
    <Link
      href={`/airport/${airport.iata}`}
      className="group block border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:border-orange-500/50 hover:bg-orange-500/[0.03] transition cursor-pointer"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-3xl font-bold text-orange-500 font-mono tracking-tight">
          {airport.iata}
        </span>
        <span className="text-xs text-white/30 font-mono">{airport.icao}</span>
      </div>
      <div className="font-semibold text-lg mb-1 leading-tight">
        {airport.name}
      </div>
      <div className="text-sm text-white/50">
        {airport.city}, {airport.country}
      </div>
    </Link>
  );
}

function AirlineCard({ airline }) {
  return (
    <Link
      href={`/airline/${airline.iata}`}
      className="group block border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:border-orange-500/50 hover:bg-orange-500/[0.03] transition cursor-pointer"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-3xl font-bold text-orange-500 font-mono tracking-tight">
          {airline.iata}
        </span>
        <span className="text-xs text-white/30 font-mono">{airline.icao}</span>
      </div>
      <div className="font-semibold text-lg mb-1 leading-tight">
        {airline.name}
      </div>
      <div className="text-sm text-white/50">{airline.country}</div>
    </Link>
  );
}