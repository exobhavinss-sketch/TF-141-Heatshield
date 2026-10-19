import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProjectFooter from '../branding/ProjectFooter';

export default function PageLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md antialiased">
      {/* Top Fixed Header */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Slide-over Mobile Navigation Drawer */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Viewport */}
      <main className="w-full pt-[76px] flex-1 flex flex-col bg-background">
        {children}
      </main>

      {/* Google Stitch Universal Footer */}
      <ProjectFooter />
    </div>
  );
}
