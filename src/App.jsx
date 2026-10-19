import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IndiaHeatMap from './pages/IndiaHeatMap';
import ExploreData from './pages/ExploreData';
import Methodology from './pages/Methodology';
import SubmitReading from './pages/SubmitReading';
import Team from './pages/Team';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heat-map" element={<IndiaHeatMap />} />
            <Route path="/explore-data" element={<ExploreData />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/team" element={<Team />} />
            <Route path="/submit-reading" element={<SubmitReading />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
