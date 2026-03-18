import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';
import Index from './pages/Index';
import ResumePage from './pages/ResumePage';
import TrackerPage from './pages/TrackerPage';
import AboutPage from './pages/AboutPage';

// Register Service Worker for PWA
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/rozgar-sathi/sw.js')
        .catch(() => {/* SW registration failed silently */});
    });
  }
}

export default function App() {
  useEffect(() => { registerSW(); }, []);

  return (
    <BrowserRouter basename="/rozgar-sathi">
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <AppHeader />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/tracker" element={<TrackerPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </div>
            <Footer />
            <InstallPrompt />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
