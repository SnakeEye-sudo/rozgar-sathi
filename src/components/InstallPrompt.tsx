import React, { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const { t } = useLang();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('rozgar-pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('rozgar-pwa-dismissed', '1');
  };

  if (!show || installed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-700 to-orange-500 flex items-center justify-center">
          <img src="/rozgar-sathi/logo.svg" alt="Rozgar Sathi" className="w-10 h-10" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-sm font-hindi">
            {t('Install Rozgar Sathi', 'रोज़गार साथी इंस्टॉल करें')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-hindi">
            {t('Add to home screen for quick access', 'होम स्क्रीन पर जोड़ें — बिना browser खोले')}
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={handleInstall}
              className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors font-hindi"
            >
              {t('Install', 'इंस्टॉल करें')}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-500 text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-hindi"
            >
              {t('Later', 'बाद में')}
            </button>
          </div>
        </div>

        <button onClick={handleDismiss} className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
