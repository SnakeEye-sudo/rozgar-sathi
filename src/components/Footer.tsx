import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💼</span>
              <span className="text-white font-bold text-lg font-hindi">रोज़गार Sathi</span>
            </div>
            <p className="text-sm text-gray-400 font-hindi leading-relaxed">
              {t(
                'Free government job portal for UPSC, BPSC, SSC, Railway, Banking aspirants.',
                'यूपीएससी, बीपीएससी, एसएससी, रेलवे, बैंकिंग उम्मीदवारों के लिए मुफ्त सरकारी नौकरी पोर्टल।'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 font-hindi">{t('Quick Links', 'त्वरित लिंक')}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: t('Job Listings', 'नौकरी सूची') },
                { to: '/resume', label: t('Resume Builder', 'रिज्यूमे बनाएं') },
                { to: '/tracker', label: t('Application Tracker', 'आवेदन ट्रैकर') },
                { to: '/about', label: t('About', 'हमारे बारे में') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors font-hindi">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><a href="/rozgar-sathi/privacy-policy.html" className="hover:text-white transition-colors text-sm font-hindi">{t('Privacy Policy', 'गोपनीयता नीति')}</a></li>
              <li><a href="/rozgar-sathi/terms.html" className="hover:text-white transition-colors text-sm font-hindi">{t('Terms & Conditions', 'नियम और शर्तें')}</a></li>
              <li><a href="/rozgar-sathi/contact.html" className="hover:text-white transition-colors text-sm font-hindi">{t('Contact Us', 'संपर्क करें')}</a></li>
            </ul>
          </div>

          {/* Sathi Series */}
          <div>
            <h3 className="text-white font-semibold mb-3 font-hindi">{t('Sathi Series', 'साथी सीरीज')}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: 'https://snakeeye-sudo.github.io/Samachar-Sathi/', label: '🗞️ Samachar Sathi' },
                { href: 'https://snakeeye-sudo.github.io/pariksha-sathi/', label: '📚 Pariksha Sathi' },
                { href: '#', label: '💼 Rozgar Sathi' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p className="font-hindi">
            {t('Made with ❤️ for UPSC/BPSC aspirants', 'यूपीएससी/बीपीएससी उम्मीदवारों के लिए ❤️ से बनाया')}
          </p>
          <p className="font-hindi">
            {t('Developed by', 'निर्मित:')} <span className="text-white font-medium">Er. Sangam Krishna</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
