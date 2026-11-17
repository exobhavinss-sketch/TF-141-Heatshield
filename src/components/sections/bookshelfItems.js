/**
 * Research Archive shelf contents — every entry is a REAL HeatShield artifact
 * or a live in-app destination. No invented publications, external links,
 * authors, or dates.
 *
 * - The four figure volumes point at the bundled exploratory data analysis
 *   charts that already exist in the project (imported below, hashed by Vite).
 * - The three platform volumes navigate to the site's real tool pages.
 * - Labels are grounded: "TF-141 · 2024" is the citation year from the
 *   project's BibTeX record; "SIM 2021–2025" is the simulation window shown
 *   across the site's UI.
 */

import distributions from '../../../edadv/figures/01_temperature_humidity_distributions.png';
import airHumidity from '../../../edadv/figures/04_air_temperature_vs_humidity.png';
import lstIndices from '../../../edadv/figures/05_lst_vs_vegetation_indices.png';
import correlations from '../../../edadv/figures/06_core_correlation_matrix.png';

export const archiveBooks = [
  {
    id: 'figure-temperature-humidity-distributions',
    title: 'Temperature & Humidity Distributions',
    date: 'TF-141 · 2024',
    href: distributions,
    color: '#16277a',
    subtitle: 'Exploratory data analysis of the HeatShield synthetic dataset.',
  },
  {
    id: 'figure-air-temperature-vs-humidity',
    title: 'Air Temperature vs Relative Humidity',
    date: 'TF-141 · 2024',
    href: airHumidity,
    color: '#2233b8',
    subtitle: 'Exploratory data analysis of the HeatShield synthetic dataset.',
  },
  {
    id: 'figure-lst-vs-vegetation-indices',
    title: 'LST vs Vegetation Indices',
    date: 'TF-141 · 2024',
    href: lstIndices,
    color: '#6b7bff',
    subtitle: 'Land-surface temperature against NDVI and NDBI relationships.',
  },
  {
    id: 'figure-core-correlation-matrix',
    title: 'Core Correlation Matrix',
    date: 'TF-141 · 2024',
    href: correlations,
    color: '#25252a',
    subtitle: 'Pearson correlations across the master dataset variables.',
  },
  {
    id: 'platform-data-explorer',
    title: 'Master Dataset Explorer',
    date: 'SIM 2021–2025',
    href: '/explore-data',
    color: '#efe8d4',
    subtitle: 'Query the 150,000-record master dataset and export visible rows.',
  },
  {
    id: 'platform-heat-map',
    title: 'India Heat Map',
    date: 'SIM 2021–2025',
    href: '/heat-map',
    color: '#0071e3',
    subtitle: 'Geographic heat surface across the monitored station grid.',
  },
  {
    id: 'platform-dashboard',
    title: 'Live Analytics Dashboard',
    date: 'SIM 2021–2025',
    href: '/dashboard',
    color: '#3a3a40',
    subtitle: 'Heat analytics overview for the Solapur observation network.',
  },
];
