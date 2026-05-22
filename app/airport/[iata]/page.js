import airports from "../../data/airports.json";
import airlines from "../../data/airlines.json";
import routes from "../../data/routes.json";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AirportPage({ params }) {
  const { iata } = await params;
  const airport = airports.find((a) => a.iata === iata.toUpperCase());

  if (!airport) {
    notFound();
  }

  const departingRoutes = routes.filter((r) => r.from === airport.iata);

  const destinationCodes = [
    ...new Set(departingRoutes.map((r) => r.to)),
  ].slice(0, 8);
  const destinations = destinationCodes
    .map((code) => airports.find((a) => a.iata === code))
    .filter(Boolean);

  const operatingAirlineCodes = [
    ...new Set(departingRoutes.map((r) => r.airline)),
  ].slice(0, 8);
  const operatingAirlines = operatingAirlineCodes
    .map((code) => airlines.find((a) => a.iata === code))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-orange-500 text-2xl">✈</span>
          <span className="font-bold tracking-widest text-lg">AEROHUB</span>
        </Link>
        <Link href="/" className="text-xs font-mono text-white/40 tracking-wider hover:text-orange-500 transition">
          ← BACK TO HUB
        </Link>
      </nav>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-6">
            — AIRPORT
          </p>
          <div className="flex items-baseline gap-6 mb-4">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-orange-500 font-mono">
              {airport.iata}
            </h1>
            <span className="text-2xl md:text-3xl font-mono text-white/30">
              {airport.icao}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3">{airport.name}</h2>
          <p className="text-white/60 text-lg">
            {airport.city}, {airport.country}
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          <Fact label="Latitude" value={airport.lat.toFixed(4)} />
          <Fact label="Longitude" value={airport.lon.toFixed(4)} />
          <Fact label="Elevation" value={airport.elevation ? `${airport.elevation} ft` : "—"} />
          <Fact label="Type" value={airport.type.replace("_", " ")} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-white/10">
        <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-3">
          — LOCATION
        </p>
        <h3 className="text-2xl font-bold mb-4">On the map</h3>
        
          href={`https://www.google.com/maps?q=${airport.lat},${airport.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-full transition"
        >
          Open in Google Maps →
        </a>
        {airport.wikipedia && (
          
            href={airport.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-block border border-white/20 hover:border-white/60 font-bold px-6 py-3 rounded-full transition"
          >
            Wikipedia →
          </a>
        )}
      </section>

      {operatingAirlines.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 border-b border-white/10">
          <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-3">
            — CARRIERS
          </p>
          <h3 className="text-3xl font-bold mb-8">Airlines operating here</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {operatingAirlines.map((al) => (
              <Link
                key={al.iata}
                href={`/airline/${al.iata}`}
                className="border border-white/10 rounded-lg p-4 hover:border-orange-500/50 hover:bg-orange-500/[0.03] transition"
              >
                <div className="font-mono text-orange-500 font-bold text-lg mb-1">
                  {al.iata}
                </div>
                <div className="text-sm text-white/80 leading-tight">
                  {al.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {destinations.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-orange-500 text-sm font-mono tracking-[0.3em] mb-3">
            — DESTINATIONS
          </p>
          <h3 className="text-3xl font-bold mb-8">Where you can fly from here</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((d) => (
              <Link
                key={d.iata}
                href={`/airport/${d.iata}`}
                className="border border-white/10 rounded-lg p-4 hover:border-orange-500/50 hover:bg-orange-500/[0.03] transition"
              >
                <div className="font-mono text-orange-500 font-bold text-xl mb-1">
                  {d.iata}
                </div>
                <div className="text-sm text-white/80 leading-tight">
                  {d.city}, {d.country}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
        <p className="font-mono tracking-wider">
          <Link href="/" className="hover:text-orange-500 transition">
            ← BACK TO AEROHUB
          </Link>
        </p>
      </footer>
    </main>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-black p-6">
      <div className="text-xs text-white/40 font-mono tracking-widest uppercase mb-2">
        {label}
      </div>
      <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
    </div>
  );
}