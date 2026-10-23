import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ProviderSearchResult } from '@fixnear/shared';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix default Leaflet icon paths in bundler environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom customer and provider pins
const customerIcon = new L.DivIcon({
  className: 'custom-customer-pin',
  html: `<div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center;">
    <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const providerIcon = new L.DivIcon({
  className: 'custom-provider-pin',
  html: `<div style="background-color: #4f46e5; color: white; width: 32px; height: 32px; border-radius: 10px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
    🔧
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface ProviderMapProps {
  providers: ProviderSearchResult[];
  centerLat?: number;
  centerLng?: number;
  selectedProviderId?: string;
  onSelectProvider?: (id: string) => void;
  className?: string;
}

// Helper component to auto-recenter map when coordinates change
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
};

export const ProviderMap: React.FC<ProviderMapProps> = ({
  providers,
  centerLat = 13.0850,
  centerLng = 80.2100,
  selectedProviderId,
  onSelectProvider,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200',
}) => {
  return (
    <div className={className}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter lat={centerLat} lng={centerLng} />

        {/* Customer approximate location indicator & 15km radius circle */}
        <Marker position={[centerLat, centerLng]} icon={customerIcon}>
          <Popup>
            <div className="text-xs font-semibold text-slate-800 p-1">
              📍 Your Selected Search Area
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[centerLat, centerLng]}
          radius={5000}
          pathOptions={{ color: '#4f46e5', fillColor: '#6366f1', fillOpacity: 0.08, weight: 1.5, dashArray: '4, 4' }}
        />

        {/* Provider Markers */}
        {providers.map(provider => {
          // Slight mock offset from city center if provider has no exact coords to avoid overlapping pins
          const lat = centerLat + (Math.sin(provider.id.charCodeAt(provider.id.length - 1)) * 0.04);
          const lng = centerLng + (Math.cos(provider.id.charCodeAt(provider.id.length - 1)) * 0.04);

          return (
            <Marker
              key={provider.id}
              position={[lat, lng]}
              icon={providerIcon}
              eventHandlers={{
                click: () => onSelectProvider?.(provider.id),
              }}
            >
              <Popup>
                <div className="w-56 p-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {provider.businessName}
                    </h4>
                    {provider.status === 'VERIFIED' && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {provider.distanceKm ? `${provider.distanceKm.toFixed(1)} km away` : 'Nearby'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2.5">
                    {provider.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{provider.startingPrice} <span className="text-[10px] font-normal text-slate-500">starting</span>
                    </span>
                    <Link
                      to={`/providers/${provider.id}`}
                      className="px-2.5 py-1 rounded bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-semibold transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
