import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IndiaHeatMap from './pages/IndiaHeatMap';
import ExploreData from './pages/ExploreData';
import Methodology from './pages/Methodology';
import Team from './pages/Team';
import Contact from './pages/Contact';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';

// User account pages
import Profile from './pages/Profile';
import SubmitReading from './pages/SubmitReading';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <PageLayout>
            <Routes>
              {/* Public Research & Platform Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/heat-map" element={<IndiaHeatMap />} />
              <Route path="/explore-data" element={<ExploreData />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* User Protected Routes */}
              <Route
                path="/submit-reading"
                element={
                  <ProtectedRoute>
                    <SubmitReading />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageLayout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
