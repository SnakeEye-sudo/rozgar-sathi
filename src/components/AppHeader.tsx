import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const FAMILY_HUB_URL = 'https://snakeeye-sudo.github.io/Aapka-Sathi/';

export default function AppHeader() {
  const { user, signInWithGoogle, logout } = useAuth();
  const { lang, toggleLang, t } = useLang();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('Jobs', 'à¤¨à¥Œà¤•à¤°à¤¿à¤¯à¤¾à¤‚') },
    { to: '/resume', label: t('Resume Builder', 'à¤°à¤¿à¤œà¥à¤¯à¥‚à¤®à¥‡ à¤¬à¤¨à¤¾à¤à¤‚') },
    { to: '/tracker', label: t('My Applications', 'à¤®à¥‡à¤°à¥‡ à¤†à¤µà¥‡à¤¦à¤¨') },
    { to: '/about', label: t('About', 'à¤¹à¤®à¤¾à¤°à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚') },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl min-w-0">
              <img
                src="/rozgar-sathi/logo.svg"
                alt="Rozgar Sathi Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-saffron-500 font-hindi">à¤°à¥‹à¤œà¤¼à¤—à¤¾à¤°</span>
              <span className="text-primary-600">Sathi</span>
            </Link>
            <a
              href={FAMILY_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center rounded-full border border-orange-300/70 dark:border-orange-400/30 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300"
            >
              Part of Aapka-Sathi Family
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-hindi ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={FAMILY_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors font-hindi text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t('Family Hub', 'à¤«à¥ˆà¤®à¤¿à¤²à¥€ à¤¹à¤¬')}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-hindi"
              title="Switch Language"
            >
              {lang === 'hi' ? 'EN' : 'à¤¹à¤¿'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || ''}
                  className="w-8 h-8 rounded-full border-2 border-primary-500"
                />
                <button
                  onClick={logout}
                  className="hidden sm:block text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  {t('Logout', 'à¤²à¥‰à¤—à¤†à¤‰à¤Ÿ')}
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t('Login', 'à¤²à¥‰à¤—à¤¿à¤¨')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
