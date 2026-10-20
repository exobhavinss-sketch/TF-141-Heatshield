import React, { useMemo } from 'react';
import { Circle } from 'react-leaflet';
import { getTemperatureColor } from '../../utils/temperatureColors';

/**
 * HeatMapIntensityLayer — Native Leaflet thermal plume diffusion layer.
 * Generates concentric, low-opacity thermal decay circles around hotspots
 * without requiring unverified external binary dependencies or crashing React Leaflet.
 * 
 * SCIENTIFIC INTEGRITY NOTE:
 * This layer visually illustrates local thermal intensity around discrete observation sites.
 * It is clearly labeled as an interpolated microclimate diffusion representation,
 * and does NOT imply a continuous physically-modeled temperature surface.
 */
export default function HeatMapIntensityLayer({
  items = [],
  enabled = true,
  intensityField = 'temperature_c'
}) {
  const intensityHotspots = useMemo(() => {
    if (!enabled || !Array.isArray(items)) return [];

    const spots = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let lat, lng, temp;

      if (item.type === 'Feature' && item.geometry) {
        lng = item.geometry.coordinates?.[0];
        lat = item.geometry.coordinates?.[1];
        temp = item.properties?.[intensityField] ?? 
               item.properties?.temperature_c ?? 
               item.properties?.mean_air_temp;
      } else {
        lat = item.latitude ?? item.lat;
        lng = item.longitude ?? item.lng;
        temp = item[intensityField] ?? item.temperature_c ?? item.mean_air_temp;
      }

      if (lat === null || lat === undefined || lng === null || lng === undefined) continue;
      const numLat = Number(lat);
      const numLng = Number(lng);
      const numTemp = Number(temp);

      if (Number.isNaN(numLat) || Number.isNaN(numLng) || Number.isNaN(numTemp)) continue;
      if (numTemp < 32) continue; // Focus intensity diffusion on elevated and severe heat sites

      const color = getTemperatureColor(numTemp);
      const intensityWeight = Math.min(Math.max((numTemp - 30) / 15, 0.2), 1.0);

      spots.push({
        id: `heat-plume-${i}`,
        center: [numLat, numLng],
        temp: numTemp,
        color,
        intensityWeight
      });
    }

    return spots;
  }, [items, enabled, intensityField]);

  if (!enabled || intensityHotspots.length === 0) return null;

  return (
    <>
      {intensityHotspots.map(({ id, center, color, intensityWeight }) => (
        <React.Fragment key={id}>
          {/* Outer halo diffusion (800m radius) */}
          <Circle
            center={center}
            radius={850}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.12 * intensityWeight,
              color: 'transparent',
              weight: 0
            }}
          />
          {/* Mid plume (450m radius) */}
          <Circle
            center={center}
            radius={450}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.22 * intensityWeight,
              color: 'transparent',
              weight: 0
            }}
          />
          {/* Core thermal accumulation (200m radius) */}
          <Circle
            center={center}
            radius={200}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.35 * intensityWeight,
              color: 'transparent',
              weight: 0
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
}
