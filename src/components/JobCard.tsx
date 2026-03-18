import React, { useState } from 'react';
import { Job, STATUS_CONFIG } from '../lib/jobData';
import { useLang } from '../context/LanguageContext';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onSave, isSaved }: JobCardProps) {
  const { lang, t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[job.status];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const daysLeft = () => {
    const end = new Date(job.importantDates.applyEnd);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return null;
    if (diff === 0) return t('Last day!', 'आखिरी दिन!');
    return t(`${diff} days left`, `${diff} दिन बचे`);
  };

  const remaining = daysLeft();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                {lang === 'hi' ? status.labelHi : status.label}
              </span>
              {remaining && job.status === 'active' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  ⏰ {remaining}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg leading-tight font-hindi">
              {lang === 'hi' ? job.titleHi : job.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-hindi">
              {lang === 'hi' ? job.organizationHi : job.organization}
            </p>
          </div>
          {onSave && (
            <button
              onClick={() => onSave(job.id)}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
              }`}
              title={isSaved ? t('Saved', 'सेव किया') : t('Save', 'सेव करें')}
            >
              <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{job.totalPosts.toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-hindi">{t('Posts', 'पद')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center">
            <div className="text-sm font-bold text-green-600 dark:text-green-400">₹{job.fees.general}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-hindi">{t('Gen Fee', 'सामान्य शुल्क')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center">
            <div className="text-sm font-bold text-green-600 dark:text-green-400">₹{job.fees.sc_st}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-hindi">{t('SC/ST Fee', 'एससी/एसटी शुल्क')}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{formatDate(job.importantDates.applyEnd)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-hindi">{t('Last Date', 'अंतिम तिथि')}</div>
          </div>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 sm:px-5 py-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 font-hindi leading-relaxed">
            {lang === 'hi' ? job.descriptionHi : job.description}
          </p>

          {/* Eligibility */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 font-hindi">
              📋 {t('Eligibility', 'पात्रता')}
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 font-hindi">
              <p>🎓 {lang === 'hi' ? job.eligibility.educationHi : job.eligibility.education}</p>
              <p>🎂 {lang === 'hi' ? job.eligibility.ageHi : job.eligibility.age}</p>
            </div>
          </div>

          {/* Fees table */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 font-hindi">
              💰 {t('Application Fees', 'आवेदन शुल्क')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {[
                { label: t('General', 'सामान्य'), amount: job.fees.general },
                { label: t('OBC', 'ओबीसी'), amount: job.fees.obc },
                { label: t('SC/ST', 'एससी/एसटी'), amount: job.fees.sc_st },
                { label: t('Female', 'महिला'), amount: job.fees.female },
              ].map(f => (
                <div key={f.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="font-bold text-gray-800 dark:text-gray-200">₹{f.amount}</div>
                  <div className="text-xs text-gray-500 font-hindi">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 font-hindi">
              📅 {t('Important Dates', 'महत्वपूर्ण तिथियां')}
            </h4>
            <div className="space-y-1 text-sm font-hindi">
              {[
                { label: t('Notification', 'अधिसूचना'), date: job.importantDates.notificationDate },
                { label: t('Apply Start', 'आवेदन शुरू'), date: job.importantDates.applyStart },
                { label: t('Apply End', 'आवेदन अंत'), date: job.importantDates.applyEnd },
                { label: t('Exam Date', 'परीक्षा तिथि'), date: job.importantDates.examDate },
                ...(job.importantDates.resultDate ? [{ label: t('Result', 'परिणाम'), date: job.importantDates.resultDate }] : []),
              ].map(d => (
                <div key={d.label} className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>{d.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatDate(d.date)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <span className="text-sm font-semibold text-green-700 dark:text-green-400 font-hindi">
              💵 {t('Salary: ', 'वेतन: ')}{lang === 'hi' ? job.salaryHi : job.salary}
            </span>
          </div>

          {/* Selection Process */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 font-hindi">
              🎯 {t('Selection Process', 'चयन प्रक्रिया')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(lang === 'hi' ? job.selectionProcessHi : job.selectionProcess).map((step, i) => (
                <span key={i} className="flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-hindi">
                  <span className="w-4 h-4 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors text-center font-hindi"
            >
              {t('Apply Online', 'ऑनलाइन आवेदन करें')} →
            </a>
            <a
              href={job.notificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center font-hindi"
            >
              📄 {t('Notification PDF', 'अधिसूचना पीडीएफ')}
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-t border-gray-100 dark:border-gray-700 font-hindi"
      >
        {expanded ? t('▲ Show Less', '▲ कम दिखाएं') : t('▼ Full Details, Fees & Apply', '▼ पूरी जानकारी, शुल्क और आवेदन')}
      </button>
    </div>
  );
}
