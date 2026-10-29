import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded pages with code-splitting
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IndiaHeatMap = lazy(() => import('./pages/IndiaHeatMap'));
const ExploreData = lazy(() => import('./pages/ExploreData'));
const Methodology = lazy(() => import('./pages/Methodology'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Profile = lazy(() => import('./pages/Profile'));
const SubmitReading = lazy(() => import('./pages/SubmitReading'));

function PageFallback() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 bg-[#fafafc] dark:bg-[#101114]">
      <div className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-[#0071e3] dark:border-t-[#2997ff] rounded-full animate-spin mb-3"></div>
      <div className="flex items-center gap-2 text-[#86868b] dark:text-[#a5a9b4] text-[12px] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] dark:bg-[#2997ff] animate-pulse"></span>
        <span className="uppercase tracking-wider font-mono">Loading View...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <PageLayout>
              <Suspense fallback={<PageFallback />}>
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
              </Suspense>
            </PageLayout>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
