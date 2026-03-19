import React, { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, Job } from '../lib/jobData';
import JobCard from '../components/JobCard';
import AdBanner from '../components/AdBanner';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { JobDataSource, loadJobs } from '../lib/googleSheetJobs';

export default function Index() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSource, setJobSource] = useState<JobDataSource | 'loading'>('loading');
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('rozgar-saved') || '[]');
  });

  useEffect(() => {
    let isMounted = true;

    void loadJobs().then(({ jobs: nextJobs, source }) => {
      if (!isMounted) return;
      setJobs(nextJobs);
      setJobSource(source);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchCat = activeCategory === 'all' || job.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        job.title.toLowerCase().includes(q) ||
        job.titleHi.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.tags.some(tag => tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, jobs, searchQuery]);

  const handleSave = async (jobId: string) => {
    const isAlreadySaved = savedJobs.includes(jobId);
    const updated = isAlreadySaved
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(updated);
    localStorage.setItem('rozgar-saved', JSON.stringify(updated));

    if (user) {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        savedJobs: isAlreadySaved ? arrayRemove(jobId) : arrayUnion(jobId),
      }).catch(() => {});
    }
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    totalPosts: jobs.reduce((sum, j) => sum + j.totalPosts, 0),
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <section className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 font-hindi">
          {t('Government Jobs â€” One Stop Shop', 'à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¨à¥Œà¤•à¤°à¥€ â€” à¤à¤• à¤œà¤—à¤¹ à¤¸à¤¬ à¤•à¥à¤›')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-hindi max-w-2xl mx-auto">
          {t(
            'Eligibility, fees, form links, exam dates â€” everything in one place. No need to search anywhere else.',
            'à¤ªà¤¾à¤¤à¥à¤°à¤¤à¤¾, à¤¶à¥à¤²à¥à¤•, à¤«à¥‰à¤°à¥à¤® à¤²à¤¿à¤‚à¤•, à¤ªà¤°à¥€à¤•à¥à¤·à¤¾ à¤¤à¤¿à¤¥à¤¿ â€” à¤¸à¤¬ à¤•à¥à¤› à¤à¤• à¤œà¤—à¤¹à¥¤ à¤•à¤¹à¥€à¤‚ à¤”à¤° à¤–à¥‹à¤œà¤¨à¥‡ à¤•à¥€ à¤œà¤°à¥‚à¤°à¤¤ à¤¨à¤¹à¥€à¤‚à¥¤'
          )}
        </p>
        <p className="mt-3 text-xs sm:text-sm text-primary-700 dark:text-primary-300 font-hindi">
          {jobSource === 'google-sheet' && t('Live Google Sheet sync is active.', 'Live Google Sheet sync active hai.')}
          {jobSource === 'fallback' && t('Backup data is showing until your Google Sheet gets rows.', 'Jab tak Google Sheet me rows nahi aati, tab tak backup data dikh raha hai.')}
          {jobSource === 'loading' && t('Syncing live Google Sheet...', 'Live Google Sheet sync ho rahi hai...')}
        </p>

        <div className="flex justify-center gap-6 mt-5">
          {[
            { value: stats.total, label: t('Active Exams', 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤ªà¤°à¥€à¤•à¥à¤·à¤¾à¤à¤‚') },
            { value: stats.active, label: t('Apply Now', 'à¤…à¤­à¥€ à¤†à¤µà¥‡à¤¦à¤¨') },
            { value: stats.totalPosts.toLocaleString('en-IN') + '+', label: t('Total Posts', 'à¤•à¥à¤² à¤ªà¤¦') },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="text-xs text-gray-500 font-hindi">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <AdBanner slot="1111111111" format="horizontal" className="mb-6 rounded-xl overflow-hidden" />

      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('Search jobs... (Railway, SSC, BPSC, Banking...)', 'à¤¨à¥Œà¤•à¤°à¥€ à¤–à¥‹à¤œà¥‡à¤‚... (à¤°à¥‡à¤²à¤µà¥‡, à¤à¤¸à¤à¤¸à¤¸à¥€, à¤¬à¥€à¤ªà¥€à¤à¤¸à¤¸à¥€, à¤¬à¥ˆà¤‚à¤•à¤¿à¤‚à¤—...)')}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-hindi"
        />
      </div>

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

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-hindi">
        {t(`${filteredJobs.length} jobs found`, `${filteredJobs.length} à¤¨à¥Œà¤•à¤°à¤¿à¤¯à¤¾à¤‚ à¤®à¤¿à¤²à¥€à¤‚`)}
      </p>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-hindi">
            <div className="text-5xl mb-3">ðŸ”</div>
            <p>
              {jobSource === 'loading'
                ? t('Sheet is syncing. Jobs will appear in a moment.', 'Sheet sync ho rahi hai. Jobs thodi der me aa jayengi.')
                : t('No jobs found. Try different search.', 'à¤•à¥‹à¤ˆ à¤¨à¥Œà¤•à¤°à¥€ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¥€à¥¤ à¤…à¤²à¤— à¤–à¥‹à¤œ à¤•à¤°à¥‡à¤‚à¥¤')}
            </p>
          </div>
        ) : (
          filteredJobs.map((job, i) => (
            <React.Fragment key={job.id}>
              <JobCard
                job={job}
                onSave={handleSave}
                isSaved={savedJobs.includes(job.id)}
              />
              {(i + 1) % 3 === 0 && i < filteredJobs.length - 1 && (
                <AdBanner slot="2222222222" format="rectangle" className="rounded-xl" />
              )}
            </React.Fragment>
          ))
        )}
      </div>

      <AdBanner slot="3333333333" format="horizontal" className="mt-8 rounded-xl" />
    </main>
  );
}
