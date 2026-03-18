import React, { useState, useMemo } from 'react';
import { JOBS, CATEGORIES, JobCategory } from '../lib/jobData';
import JobCard from '../components/JobCard';
import AdBanner from '../components/AdBanner';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Index() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('rozgar-saved') || '[]');
  });

  const filteredJobs = useMemo(() => {
    return JOBS.filter(job => {
      const matchCat = activeCategory === 'all' || job.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        job.title.toLowerCase().includes(q) ||
        job.titleHi.includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.tags.some(tag => tag.includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSave = async (jobId: string) => {
    const isAlreadySaved = savedJobs.includes(jobId);
    const updated = isAlreadySaved
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(updated);
    localStorage.setItem('rozgar-saved', JSON.stringify(updated));

    // Sync to Firestore if logged in
    if (user) {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        savedJobs: isAlreadySaved ? arrayRemove(jobId) : arrayUnion(jobId),
      }).catch(() => {});
    }
  };

  const stats = {
    total: JOBS.length,
    active: JOBS.filter(j => j.status === 'active').length,
    totalPosts: JOBS.reduce((sum, j) => sum + j.totalPosts, 0),
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero */}
      <section className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 font-hindi">
          {t('Government Jobs — One Stop Shop', 'सरकारी नौकरी — एक जगह सब कुछ')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-hindi max-w-2xl mx-auto">
          {t(
            'Eligibility, fees, form links, exam dates — everything in one place. No need to search anywhere else.',
            'पात्रता, शुल्क, फॉर्म लिंक, परीक्षा तिथि — सब कुछ एक जगह। कहीं और खोजने की जरूरत नहीं।'
          )}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-5">
          {[
            { value: stats.total, label: t('Active Exams', 'सक्रिय परीक्षाएं') },
            { value: stats.active, label: t('Apply Now', 'अभी आवेदन') },
            { value: stats.totalPosts.toLocaleString('en-IN') + '+', label: t('Total Posts', 'कुल पद') },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="text-xs text-gray-500 font-hindi">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner slot="1111111111" format="horizontal" className="mb-6 rounded-xl overflow-hidden" />

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('Search jobs... (Railway, SSC, BPSC, Banking...)', 'नौकरी खोजें... (रेलवे, एसएससी, बीपीएससी, बैंकिंग...)')}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-hindi"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors font-hindi ${
              activeCategory === cat.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{lang === 'hi' ? cat.labelHi : cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-hindi">
        {t(`${filteredJobs.length} jobs found`, `${filteredJobs.length} नौकरियां मिलीं`)}
      </p>

      {/* Job cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-hindi">
            <div className="text-5xl mb-3">🔍</div>
            <p>{t('No jobs found. Try different search.', 'कोई नौकरी नहीं मिली। अलग खोज करें।')}</p>
          </div>
        ) : (
          filteredJobs.map((job, i) => (
            <React.Fragment key={job.id}>
              <JobCard
                job={job}
                onSave={handleSave}
                isSaved={savedJobs.includes(job.id)}
              />
              {/* Ad after every 3 cards */}
              {(i + 1) % 3 === 0 && i < filteredJobs.length - 1 && (
                <AdBanner slot="2222222222" format="rectangle" className="rounded-xl" />
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Bottom ad */}
      <AdBanner slot="3333333333" format="horizontal" className="mt-8 rounded-xl" />
    </main>
  );
}
