import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { SearchData } from "./+data";
import { useData } from "vike-react/useData";

Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// Helper component to fly to a location
function FlyTo({ position }: { position: [number, number] }) {
  const map = useMap();
  map.flyTo(position, 15, { duration: 1.5 });
  return null;
}

export default function Page() {
  const { features } = useData<SearchData>();
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");

  // Filter features based on query
  const filtered = features.filter((feature) => feature.title?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-100 p-4 overflow-y-auto border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">Features</h2>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-400 rounded"
        />

        {/* List of filtered features */}
        <ul className="space-y-2">
          {filtered.map((feature) => {
            if (!feature.latLong || feature.latLong.length !== 2) return null;
            const pos: [number, number] = fixLatLong(feature.latLong, feature.title)!;
            return (
              <li key={feature.SK}>
                <button onClick={() => setSelected(pos)} className="w-full text-left p-2 rounded hover:bg-gray-200">
                  {feature.title}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="text-gray-500 italic">No results</li>}
        </ul>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer center={[37.3387, -121.8853]} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {features.map((feature) => {
            const pos = fixLatLong(feature.latLong, feature.title);
            if (!pos) return null;
            return (
              <Marker key={feature.SK} position={pos}>
                <Popup>
                  <strong>{feature.title}</strong>
                  <br />
                  {feature.description}
                </Popup>
              </Marker>
            );
          })}

          {/* FlyTo runs only when user clicks sidebar */}
          {selected && <FlyTo position={selected} />}
        </MapContainer>
      </div>
    </div>
  );
}

const fixLatLong = (latLong: string[] | undefined, featureTitle: string | undefined): [number, number] | null => {
  // Some of the data is malformed, we will need to fix it later.
  // For now, just switch lat and lng if lng is greater than lat
  if (!latLong || latLong.length !== 2) return null;
  const lat = parseFloat(latLong[0]);
  const lng = parseFloat(latLong[1]);
  if (lng > lat) {
    console.warn(`Fixing latLong for feature "${featureTitle}": [${lat}, ${lng}] -> [${lng}, ${lat}]`);
    return [lng, lat];
  }
  return [lat, lng];
};
