import React from 'react';
import { useLang } from '../context/LanguageContext';

const FAMILY_HUB_URL = 'https://snakeeye-sudo.github.io/Aapka-Sathi/';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-900/95 text-gray-300 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-hindi text-gray-400">
          {t(
            'Rozgar Sathi keeps job search, resume, and tracker flow app-first and distraction-light.',
            'Rozgar Sathi job search, resume aur tracker ko app-first aur distraction-light rakhta hai.'
          )}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={FAMILY_HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-gray-700 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
          >
            {t('Aapka-Sathi Family', 'Aapka-Sathi Family')}
          </a>
          <p className="font-hindi text-gray-500">
            {t('Developed by', 'निर्मित:')} <span className="text-white font-medium">Er. Sangam Krishna</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
