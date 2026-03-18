import React from 'react';
import { useLang } from '../context/LanguageContext';
import AdBanner from '../components/AdBanner';

export default function AboutPage() {
  const { t } = useLang();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 font-hindi">
        {t('About Rozgar Sathi', 'रोज़गार साथी के बारे में')}
      </h1>

      <AdBanner slot="7777777777" format="horizontal" className="mb-8 rounded-xl" />

      <div className="space-y-6 text-gray-700 dark:text-gray-300 font-hindi leading-relaxed">
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            💼 {t('What is Rozgar Sathi?', 'रोज़गार साथी क्या है?')}
          </h2>
          <p>
            {t(
              'Rozgar Sathi is a free, one-stop platform for government job aspirants in India. We aggregate sarkari naukri vacancies from Railway, SSC, Banking, UPSC, BPSC, and State PSCs — with complete details about eligibility, fees, important dates, and direct apply links.',
              'रोज़गार साथी भारत में सरकारी नौकरी के इच्छुक उम्मीदवारों के लिए एक मुफ्त, वन-स्टॉप प्लेटफॉर्म है। हम रेलवे, एसएससी, बैंकिंग, यूपीएससी, बीपीएससी और राज्य पीएससी से सरकारी नौकरी की रिक्तियों को एकत्रित करते हैं — पात्रता, शुल्क, महत्वपूर्ण तिथियों और सीधे आवेदन लिंक के साथ।'
            )}
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ✨ {t('Features', 'विशेषताएं')}
          </h2>
          <ul className="space-y-2">
            {[
              t('📋 Sarkari vacancy listings with full details', '📋 पूरी जानकारी के साथ सरकारी रिक्ति सूची'),
              t('💰 Fee structure for all categories (Gen/OBC/SC/ST/Female)', '💰 सभी श्रेणियों के लिए शुल्क संरचना'),
              t('📅 Important dates — notification, apply, exam, result', '📅 महत्वपूर्ण तिथियां — अधिसूचना, आवेदन, परीक्षा, परिणाम'),
              t('🎯 Selection process step-by-step', '🎯 चरण-दर-चरण चयन प्रक्रिया'),
              t('📄 Free resume builder with PDF download', '📄 पीडीएफ डाउनलोड के साथ मुफ्त रिज्यूमे बिल्डर'),
              t('📊 Application tracker to manage your applications', '📊 आवेदन ट्रैकर'),
              t('🔐 Google Sign-In — same account works on Samachar Sathi & Pariksha Sathi', '🔐 गूगल साइन-इन — समाचार साथी और परीक्षा साथी पर भी काम करता है'),
              t('🌐 Hindi & English support', '🌐 हिंदी और अंग्रेजी समर्थन'),
              t('📱 Mobile friendly design', '📱 मोबाइल फ्रेंडली डिज़ाइन'),
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            🔗 {t('Sathi Series', 'साथी सीरीज')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Samachar Sathi', emoji: '🗞️', desc: t('Daily news analysis & MCQ for UPSC/BPSC', 'यूपीएससी/बीपीएससी के लिए दैनिक समाचार विश्लेषण'), url: 'https://snakeeye-sudo.github.io/Samachar-Sathi/' },
              { name: 'Pariksha Sathi', emoji: '📚', desc: t('Study planner & notes', 'अध्ययन योजनाकार और नोट्स'), url: 'https://snakeeye-sudo.github.io/pariksha-sathi/' },
              { name: 'Rozgar Sathi', emoji: '💼', desc: t('Sarkari jobs one stop shop', 'सरकारी नौकरी वन स्टॉप शॉप'), url: '#' },
            ].map(app => (
              <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                className="block p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                <div className="text-2xl mb-1">{app.emoji}</div>
                <div className="font-bold text-primary-700 dark:text-primary-300">{app.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-hindi">{app.desc}</div>
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 font-hindi">
            {t('One Google login works across all three apps.', 'एक गूगल लॉगिन तीनों ऐप्स पर काम करता है।')}
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            👨‍💻 {t('Developer', 'डेवलपर')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-2xl">
              👨‍💻
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Er. Sangam Krishna</p>
              <a href="https://github.com/SnakeEye-sudo" target="_blank" rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                @SnakeEye-sudo on GitHub
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-hindi">
                {t('Building free tools for UPSC/BPSC aspirants.', 'यूपीएससी/बीपीएससी उम्मीदवारों के लिए मुफ्त टूल बना रहे हैं।')}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ⚠️ {t('Disclaimer', 'अस्वीकरण')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-hindi">
            {t(
              'Rozgar Sathi is an informational platform. Always verify job details from official websites before applying. We are not responsible for any errors in vacancy information. Apply links redirect to official government portals.',
              'रोज़गार साथी एक सूचनात्मक प्लेटफॉर्म है। आवेदन करने से पहले हमेशा आधिकारिक वेबसाइटों से नौकरी की जानकारी सत्यापित करें। रिक्ति जानकारी में किसी भी त्रुटि के लिए हम जिम्मेदार नहीं हैं।'
            )}
          </p>
        </section>
      </div>

      <AdBanner slot="8888888888" format="horizontal" className="mt-8 rounded-xl" />
    </main>
  );
}
