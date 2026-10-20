import React, { useMemo } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import HeatMapPopup from './HeatMapPopup';
import { 
  getTemperatureColor, 
  getRiskCategoryColor,
  calculateHeatRiskCategory 
} from '../../utils/temperatureColors';

/**
 * Validates numeric coordinate values safely
 */
function isValidCoord(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (Number.isNaN(numLat) || Number.isNaN(numLng)) return false;
  return numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180;
}

/**
 * Normalizes input item (GeoJSON Feature or plain data record) into uniform marker descriptor
 */
function normalizeMarker(item, index) {
  if (!item) return null;

  // Handle GeoJSON Feature
  if (item.type === 'Feature' && item.geometry) {
    const coords = item.geometry.coordinates; // [lng, lat]
    if (!Array.isArray(coords) || coords.length < 2) return null;
    const lng = coords[0];
    const lat = coords[1];
    if (!isValidCoord(lat, lng)) return null;

    const props = item.properties || {};
    const id = item.id || props.grid_id || props.location_id || props.station_id || `feature-${index}`;

    return {
      id,
      lat: Number(lat),
      lng: Number(lng),
      props: {
        ...props,
        latitude: Number(lat),
        longitude: Number(lng)
      }
    };
  }

  // Handle Plain Record (Supabase heat_readings, locations table, or SOLAPUR_STATIONS)
  const lat = item.latitude ?? item.lat;
  const lng = item.longitude ?? item.lng;
  if (!isValidCoord(lat, lng)) return null;

  const id = item.id || item.location_id || item.station_id || `marker-${index}`;

  return {
    id,
    lat: Number(lat),
    lng: Number(lng),
    props: {
      ...item,
      latitude: Number(lat),
      longitude: Number(lng)
    }
  };
}

/**
 * HeatMapMarkers — High-performance, resilient marker renderer for HeatShield.
 */
function HeatMapMarkersComponent({
  items = [],
  selectedLayer = 'air_temp',
  selectedLocationId = null,
  onSelectLocation,
  riskFilter = 'all',
  isSolapur = true
}) {
  // Normalize and filter markers with coordinates validation
  const validMarkers = useMemo(() => {
    if (!Array.isArray(items)) return [];
    
    const results = [];
    for (let i = 0; i < items.length; i++) {
      const normalized = normalizeMarker(items[i], i);
      if (!normalized) continue;

      // Risk category filter
      if (riskFilter && riskFilter !== 'all') {
        const itemRisk = normalized.props.risk_category || 
                         normalized.props.heat_risk_category || 
                         calculateHeatRiskCategory(normalized.props.temperature_c ?? normalized.props.mean_air_temp);
        if (itemRisk?.toLowerCase() !== riskFilter.toLowerCase()) {
          continue;
        }
      }

      results.push(normalized);
    }
    return results;
  }, [items, riskFilter]);

  return (
    <>
      {validMarkers.map(({ id, lat, lng, props }) => {
        // Determine temperature or metric value for color-coding
        let colorValue = props.temperature_c ?? props.air_temperature_c ?? props.mean_air_temp;
        let markerColor = getTemperatureColor(colorValue);

        if (selectedLayer === 'surface_lst') {
          const lstVal = props.surface_temp_c ?? props.land_surface_temp_c ?? props.mean_lst;
          if (lstVal !== undefined && lstVal !== null) {
            colorValue = lstVal;
            markerColor = getTemperatureColor(lstVal);
          }
        } else if (selectedLayer === 'cooling_score' && props.cooling_priority_score !== undefined) {
          const score = Number(props.cooling_priority_score);
          markerColor = score > 65 ? '#ef4444' : score > 45 ? '#f97316' : score > 25 ? '#facc15' : '#10b981';
        } else if (selectedLayer === 'risk') {
          const cat = props.risk_category || props.heat_risk_category || calculateHeatRiskCategory(colorValue);
          markerColor = getRiskCategoryColor(cat);
        }

        const isSelected = selectedLocationId && (
          String(selectedLocationId) === String(id) ||
          String(selectedLocationId) === String(props.location_id) ||
          String(selectedLocationId) === String(props.station_id)
        );

        const isHotspot = props.risk_category === 'Very High' || (typeof colorValue === 'number' && colorValue >= 40);

        // Marker radius calculations
        let radius = isSolapur ? 7 : 9;
        if (isHotspot) radius = isSolapur ? 9 : 11;
        if (isSelected) radius = isSolapur ? 12 : 14;

        return (
          <CircleMarker
            key={id}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              fillColor: markerColor,
              fillOpacity: isSelected ? 0.95 : 0.85,
              color: isSelected ? '#ffffff' : (isHotspot ? '#ba1a1a' : markerColor),
              weight: isSelected ? 3 : (isHotspot ? 2 : 1),
              opacity: 0.95
            }}
            eventHandlers={{
              click: () => {
                if (onSelectLocation) {
                  onSelectLocation(props);
                }
              }
            }}
          >
            <Popup className="heatshield-dark-popup" maxWidth={300}>
              <HeatMapPopup properties={props} />
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default React.memo(HeatMapMarkersComponent);
