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

const FAMILY_THEME_KEY = 'sathi-family-theme';
const FAMILY_THEME_MODE_KEY = 'sathi-family-theme-mode';

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
  useEffect(() => {
    registerSW();

    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyFamilyTheme = () => {
      const themePreference = localStorage.getItem(FAMILY_THEME_MODE_KEY) || localStorage.getItem(FAMILY_THEME_KEY) || 'system';
      const resolvedTheme = themePreference === 'system'
        ? (systemThemeQuery.matches ? 'dark' : 'light')
        : themePreference;
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    };

    applyFamilyTheme();

    const handleSystemThemeChange = () => {
      if ((localStorage.getItem(FAMILY_THEME_MODE_KEY) || 'system') === 'system') {
        applyFamilyTheme();
      }
    };

    if (typeof systemThemeQuery.addEventListener === 'function') {
      systemThemeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof systemThemeQuery.addListener === 'function') {
      systemThemeQuery.addListener(handleSystemThemeChange);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === FAMILY_THEME_KEY || event.key === FAMILY_THEME_MODE_KEY) {
        applyFamilyTheme();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
