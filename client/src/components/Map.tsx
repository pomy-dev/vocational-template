import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "../lib/utils";

// Fix default marker icons (Vite/Webpack often break the paths)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  sublabel?: string;
};

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  /** Called when user clicks the map or finishes dragging the marker */
  onLocationChange?: (lat: number, lng: number) => void;
  /** Optional: expose the map instance if you still need it */
  onMapReady?: (map: L.Map) => void;
  /** When true, marker is draggable and clicks set position */
  interactive?: boolean;
  /** Multiple school (or other) locations */
  markers?: MapMarker[];
}

/** Keeps the map centered when lat/lng props change from outside (single-marker mode) */
function Recenter({ center, enabled, }: { center: { lat: number; lng: number }; enabled: boolean; }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map, enabled]);
  return null;
}

/** Fit bounds when showing several markers */
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (!markers.length) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], map.getZoom());
      return;
    }
    const bounds = L.latLngBounds(
      markers.map((m) => [m.lat, m.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
  }, [markers, map]);
  return null;
}

/** Handles click-to-place when interactive */
function ClickHandler({ onLocationChange, }: { onLocationChange?: (lat: number, lng: number) => void; }) {
  useMapEvents({
    click(e) {
      onLocationChange?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// export function MapView({
//   className,
//   initialCenter = { lat: -26.4852, lng: 31.3073 }, // Matsapha default
//   initialZoom = 14,
//   onLocationChange,
//   onMapReady,
//   interactive = false,
//   markers,
// }: MapViewProps) {
//   const hasMulti = Array.isArray(markers) && markers.length > 0;

//   // Single interactive pin follows initialCenter; multi mode uses markers list
//   const singlePosition = initialCenter;
//   const shouldRecenter = !hasMulti && !interactive;

//   return (
//     <div className={cn("w-full h-[500px]", className)}>
//       <MapContainer
//         center={[initialCenter.lat, initialCenter.lng]}
//         zoom={initialZoom}
//         className="h-full w-full rounded-b-xl"
//         scrollWheelZoom={true}
//         ref={(map) => {
//           if (map && onMapReady) onMapReady(map);
//         }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Don't fight fitBounds when showing many schools */}
//         <Recenter center={initialCenter} enabled={shouldRecenter} />

//         {hasMulti && <FitBounds markers={markers!} />}

//         {interactive && !hasMulti && (
//           <ClickHandler onLocationChange={onLocationChange} />
//         )}

//         {hasMulti ? (
//           markers!.map((m) => (
//             <Marker key={m.id} position={[m.lat, m.lng]}>
//               {(m.label || m.sublabel) && (
//                 <Popup>
//                   {m.label && (
//                     <div className="font-semibold text-sm">{m.label}</div>
//                   )}
//                   {m.sublabel && (
//                     <div className="mt-0.5 text-xs text-ink/60">{m.sublabel}</div>
//                   )}
//                 </Popup>
//               )}
//             </Marker>
//           ))
//         ) : (
//           <Marker
//             key={`${singlePosition.lat.toFixed(6)}-${singlePosition.lng.toFixed(6)}`}
//             position={[singlePosition.lat, singlePosition.lng]}
//             draggable={interactive}
//             eventHandlers={
//               interactive
//                 ? {
//                   dragend: (e) => {
//                     const marker = e.target;
//                     const pos = marker.getLatLng();
//                     onLocationChange?.(pos.lat, pos.lng);
//                   },
//                 }
//                 : undefined
//             }
//           />
//         )}
//       </MapContainer>
//     </div>
//   );
// }

export function MapView({
  className,
  initialCenter = { lat: -26.4852, lng: 31.3073 },
  initialZoom = 14,
  onLocationChange,
  onMapReady,
  interactive = false,
  markers,
}: MapViewProps) {
  // Multi pins only when NOT picking a location
  const multiMarkers =
    !interactive && Array.isArray(markers) && markers.length > 0
      ? markers
      : null;

  const showMulti = multiMarkers !== null && multiMarkers.length > 0;

  return (
    <div className={cn("h-[500px] w-full", className)}>
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={initialZoom}
        className="h-full w-full rounded-b-xl"
        scrollWheelZoom={true}
        ref={(map) => {
          if (map && onMapReady) onMapReady(map);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter center={initialCenter} enabled={!showMulti} />

        {showMulti && <FitBounds markers={multiMarkers!} />}

        {interactive && (
          <ClickHandler onLocationChange={onLocationChange} />
        )}

        {showMulti ? (
          multiMarkers!.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              {(m.label || m.sublabel) && (
                <Popup>
                  {m.label && (
                    <div className="font-semibold text-sm">{m.label}</div>
                  )}
                  {m.sublabel && (
                    <div className="mt-0.5 text-xs opacity-70">{m.sublabel}</div>
                  )}
                </Popup>
              )}
            </Marker>
          ))
        ) : (
          <Marker
            // key forces Leaflet to respect position updates after drag/click
            key={`${initialCenter.lat.toFixed(5)}-${initialCenter.lng.toFixed(5)}`}
            position={[initialCenter.lat, initialCenter.lng]}
            draggable={interactive}
            eventHandlers={
              interactive
                ? {
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    onLocationChange?.(pos.lat, pos.lng);
                  },
                }
                : undefined
            }
          />
        )}
      </MapContainer>
    </div>
  );
}
