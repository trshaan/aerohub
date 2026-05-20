// scripts/prepare-data.js
// Converts raw aviation CSVs into clean JSON files our app uses.

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const DATA_DIR = path.join(__dirname, '..', 'data');

// ---------- AIRPORTS ----------
console.log('Reading airports.csv...');
const airportsRaw = fs.readFileSync(path.join(DATA_DIR, 'airports.csv'), 'utf8');
const airportsParsed = parse(airportsRaw, { columns: true, skip_empty_lines: true });

const airports = airportsParsed
  .filter(a => a.iata_code && (a.type === 'large_airport' || a.type === 'medium_airport'))
  .map(a => ({
    id: a.id,
    iata: a.iata_code,
    icao: a.icao_code || a.ident,
    name: a.name,
    city: a.municipality,
    country: a.iso_country,
    type: a.type,
    lat: parseFloat(a.latitude_deg),
    lon: parseFloat(a.longitude_deg),
    elevation: a.elevation_ft ? parseInt(a.elevation_ft, 10) : null,
    wikipedia: a.wikipedia_link || null,
  }));

console.log('Kept ' + airports.length + ' airports (large + medium with IATA codes)');
fs.writeFileSync(path.join(DATA_DIR, 'airports.json'), JSON.stringify(airports, null, 2));
console.log('Wrote airports.json');

// ---------- AIRLINES ----------
console.log('\nReading airlines.dat...');
const airlinesRaw = fs.readFileSync(path.join(DATA_DIR, 'airlines.dat'), 'utf8');
const airlinesParsed = parse(airlinesRaw, { skip_empty_lines: true });

const airlines = airlinesParsed
  .map(row => ({
    id: row[0],
    name: row[1],
    alias: row[2] === '\\N' ? null : row[2],
    iata: row[3] === '-' || row[3] === '' ? null : row[3],
    icao: row[4] === 'N/A' || row[4] === '' ? null : row[4],
    callsign: row[5] || null,
    country: row[6] || null,
    active: row[7] === 'Y',
  }))
  .filter(a => a.active && a.name && a.iata);

console.log('Kept ' + airlines.length + ' active airlines');
fs.writeFileSync(path.join(DATA_DIR, 'airlines.json'), JSON.stringify(airlines, null, 2));
console.log('Wrote airlines.json');

// ---------- ROUTES ----------
console.log('\nReading routes.dat...');
const routesRaw = fs.readFileSync(path.join(DATA_DIR, 'routes.dat'), 'utf8');
const routesParsed = parse(routesRaw, { skip_empty_lines: true });

const routes = routesParsed
  .map(row => ({
    airline: row[0],
    from: row[2],
    to: row[4],
    stops: parseInt(row[7], 10) || 0,
    aircraft: row[8] || null,
  }))
  .filter(r => r.from && r.to && r.airline);

console.log('Kept ' + routes.length + ' routes');
fs.writeFileSync(path.join(DATA_DIR, 'routes.json'), JSON.stringify(routes, null, 2));
console.log('Wrote routes.json');

console.log('\nAll done!');
