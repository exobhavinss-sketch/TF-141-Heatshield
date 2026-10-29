import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProjectFooter from '../branding/ProjectFooter';

export default function PageLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans antialiased selection:bg-[#0071e3]/15 selection:text-[#0071e3] transition-colors duration-200">
      {/* Top Fixed Header */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Slide-over Mobile Navigation Drawer */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Viewport with Apple 52px top padding */}
      <main className="w-full pt-[52px] flex-1 flex flex-col bg-white dark:bg-[#101114] transition-colors duration-200">
        {children}
      </main>

      {/* Apple-grade Universal Footer */}
      <ProjectFooter />
    </div>
  );
}
