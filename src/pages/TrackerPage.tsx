import React, { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

type AppStatus = 'applied' | 'admit_card' | 'exam_done' | 'result_awaited' | 'selected' | 'rejected';

interface Application {
  id: string;
  jobTitle: string;
  organization: string;
  applyDate: string;
  examDate: string;
  status: AppStatus;
  notes: string;
  registrationNo: string;
}

const STATUS_OPTIONS: { value: AppStatus; label: string; labelHi: string; color: string }[] = [
  { value: 'applied', label: 'Applied', labelHi: 'आवेदन किया', color: 'bg-blue-100 text-blue-800' },
  { value: 'admit_card', label: 'Admit Card Out', labelHi: 'एडमिट कार्ड आया', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'exam_done', label: 'Exam Done', labelHi: 'परीक्षा दी', color: 'bg-purple-100 text-purple-800' },
  { value: 'result_awaited', label: 'Result Awaited', labelHi: 'परिणाम का इंतजार', color: 'bg-orange-100 text-orange-800' },
  { value: 'selected', label: 'Selected ✓', labelHi: 'चयनित ✓', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Not Selected', labelHi: 'चयनित नहीं', color: 'bg-red-100 text-red-800' },
];

const EMPTY_APP: Omit<Application, 'id'> = {
  jobTitle: '', organization: '', applyDate: '', examDate: '',
  status: 'applied', notes: '', registrationNo: '',
};

export default function TrackerPage() {
  const { t, lang } = useLang();
  const { user, signInWithGoogle } = useAuth();
  const [apps, setApps] = useState<Application[]>(() => {
    return JSON.parse(localStorage.getItem('rozgar-tracker') || '[]');
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Application, 'id'>>(EMPTY_APP);
  const [editId, setEditId] = useState<string | null>(null);

  const saveApps = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem('rozgar-tracker', JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!form.jobTitle) return;
    if (editId) {
      saveApps(apps.map(a => a.id === editId ? { ...form, id: editId } : a));
      setEditId(null);
    } else {
      saveApps([...apps, { ...form, id: Date.now().toString() }]);
    }
    setForm(EMPTY_APP);
    setShowForm(false);
  };

  const handleEdit = (app: Application) => {
    setForm({ ...app });
    setEditId(app.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('Delete this application?', 'यह आवेदन हटाएं?'))) {
      saveApps(apps.filter(a => a.id !== id));
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-hindi";

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = apps.filter(a => a.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-hindi">
            📊 {t('My Applications', 'मेरे आवेदन')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-hindi">
            {t('Track all your job applications in one place.', 'सभी आवेदनों को एक जगह ट्रैक करें।')}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_APP); }}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors font-hindi"
        >
          + {t('Add', 'जोड़ें')}
        </button>
      </div>

      {/* Login prompt */}
      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-hindi">
            {t('Login to sync your applications across devices.', 'डिवाइस के पार सिंक करने के लिए लॉगिन करें।')}
          </p>
          <button onClick={signInWithGoogle} className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-hindi">
            {t('Login', 'लॉगिन')}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {STATUS_OPTIONS.map(s => (
          <div key={s.value} className={`rounded-lg p-2 text-center ${s.color}`}>
            <div className="text-xl font-bold">{statusCounts[s.value] || 0}</div>
            <div className="text-xs font-hindi">{lang === 'hi' ? s.labelHi : s.label}</div>
          </div>
        ))}
      </div>

      <AdBanner slot="6666666666" format="horizontal" className="mb-6 rounded-xl" />

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 font-hindi">
            {editId ? t('Edit Application', 'आवेदन संपादित करें') : t('Add New Application', 'नया आवेदन जोड़ें')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Job Title *', 'नौकरी का नाम *')}</label>
              <input type="text" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} className={inputClass} placeholder="SSC CGL 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Organization', 'संगठन')}</label>
              <input type="text" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className={inputClass} placeholder="SSC" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Registration No.', 'पंजीकरण संख्या')}</label>
              <input type="text" value={form.registrationNo} onChange={e => setForm({ ...form, registrationNo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Status', 'स्थिति')}</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AppStatus })} className={inputClass}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{lang === 'hi' ? s.labelHi : s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Apply Date', 'आवेदन तिथि')}</label>
              <input type="date" value={form.applyDate} onChange={e => setForm({ ...form, applyDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Exam Date', 'परीक्षा तिथि')}</label>
              <input type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi">{t('Notes', 'नोट्स')}</label>
              <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputClass} placeholder={t('Hall ticket downloaded, fee paid...', 'हॉल टिकट डाउनलोड, शुल्क भुगतान...')} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 font-hindi">
              {editId ? t('Update', 'अपडेट करें') : t('Save', 'सेव करें')}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-hindi">
              {t('Cancel', 'रद्द करें')}
            </button>
          </div>
        </div>
      )}

      {/* Applications list */}
      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-hindi">{t('No applications yet. Add your first one!', 'अभी कोई आवेदन नहीं। पहला जोड़ें!')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(app => {
            const statusInfo = STATUS_OPTIONS.find(s => s.value === app.status)!;
            return (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {lang === 'hi' ? statusInfo.labelHi : statusInfo.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white font-hindi">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-hindi">{app.organization}</p>
                    {app.registrationNo && (
                      <p className="text-xs text-gray-400 mt-0.5 font-hindi">
                        {t('Reg No:', 'पंजीकरण:')} {app.registrationNo}
                      </p>
                    )}
                    {app.notes && <p className="text-xs text-gray-400 mt-0.5 font-hindi">📝 {app.notes}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-gray-400 font-hindi">
                      {app.applyDate && <span>📅 {t('Applied:', 'आवेदन:')} {new Date(app.applyDate).toLocaleDateString('en-IN')}</span>}
                      {app.examDate && <span>📝 {t('Exam:', 'परीक्षा:')} {new Date(app.examDate).toLocaleDateString('en-IN')}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(app)} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
