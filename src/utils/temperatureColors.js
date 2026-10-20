/**
 * Temperature color scale configuration and utility functions.
 * Designed to provide truthful, accessible color-coding for temperature observations.
 * 
 * Note: These thresholds represent analytical visualization tiers,
 * NOT official medical heat-wave warnings or IMD disaster alerts.
 */

export const DEFAULT_THRESHOLDS = [
  { max: 15, color: '#00e5ff', label: '< 15°C', name: 'Cool / Mild', bgClass: 'bg-cyan-400' },
  { min: 15, max: 25, color: '#10b981', label: '15°C – 25°C', name: 'Moderate', bgClass: 'bg-emerald-500' },
  { min: 25, max: 30, color: '#facc15', label: '25°C – 30°C', name: 'Warm', bgClass: 'bg-amber-300' },
  { min: 30, max: 35, color: '#f97316', label: '30°C – 35°C', name: 'Elevated Heat', bgClass: 'bg-orange-500' },
  { min: 35, color: '#ef4444', label: '≥ 35°C', name: 'Severe Heat', bgClass: 'bg-red-500' },
];

export const MISSING_DATA_COLOR = '#64748b'; // Slate 500

/**
 * Returns hex color code for a given temperature in Celsius.
 * Handles null, undefined, NaN, and missing values by returning gray.
 */
export function getTemperatureColor(temp, thresholds = DEFAULT_THRESHOLDS) {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return MISSING_DATA_COLOR;
  }

  const num = Number(temp);

  if (num < 15) return '#00e5ff'; // Teal / Cyan
  if (num < 25) return '#10b981'; // Green
  if (num < 30) return '#facc15'; // Yellow
  if (num < 35) return '#f97316'; // Orange
  return '#ef4444'; // Red (35°C and above)
}

/**
 * Returns risk category color according to HeatShield standard tiers:
 * Low, Moderate, High, Very High
 */
export function getHeatRiskBadge(riskCategory) {
  switch (riskCategory?.toLowerCase()) {
    case 'low':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        dot: 'bg-orange-400',
      };
    case 'very high':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        dot: 'bg-red-400',
      };
    default:
      return {
        bg: 'bg-slate-700/20',
        text: 'text-slate-400',
        border: 'border-slate-600/30',
        dot: 'bg-slate-400',
      };
  }
}

/**
 * Returns zone typology accent style
 */
export function getZoneBadge(zoneType) {
  switch (zoneType?.toLowerCase()) {
    case 'commercial':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'industrial':
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'residential':
      return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    case 'road':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'park':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'waterbody':
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

/**
 * Calculates HeatShield heat-risk category from temperature reading.
 * Thresholds: <30°C Low, 30-35°C Moderate, 35-40°C High, ≥40°C Very High
 */
export function calculateHeatRiskCategory(temp) {
  if (temp === null || temp === undefined || isNaN(temp)) return 'Unknown';
  const val = Number(temp);
  if (val < 30) return 'Low';
  if (val < 35) return 'Moderate';
  if (val < 40) return 'High';
  return 'Very High';
}

/**
 * Returns solid color hex code corresponding to risk category.
 */
export function getRiskCategoryColor(category) {
  switch (category?.toLowerCase()) {
    case 'low':
      return '#10b981';
    case 'moderate':
      return '#facc15';
    case 'high':
      return '#f97316';
    case 'very high':
      return '#ef4444';
    default:
      return MISSING_DATA_COLOR;
  }
}

