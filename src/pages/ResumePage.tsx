import React, { useState, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

interface ResumeData {
  name: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  fatherName: string;
  category: string;
  objective: string;
  education: { degree: string; institute: string; year: string; percentage: string }[];
  experience: { role: string; org: string; from: string; to: string; desc: string }[];
  skills: string;
  languages: string;
  hobbies: string;
  declaration: boolean;
}

const EMPTY: ResumeData = {
  name: '', phone: '', email: '', address: '', dob: '', fatherName: '', category: '',
  objective: '',
  education: [{ degree: '', institute: '', year: '', percentage: '' }],
  experience: [],
  skills: '', languages: 'Hindi, English', hobbies: '',
  declaration: true,
};

export default function ResumePage() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('rozgar-resume');
    return saved ? JSON.parse(saved) : EMPTY;
  });
  const [preview, setPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const save = (updated: ResumeData) => {
    setData(updated);
    localStorage.setItem('rozgar-resume', JSON.stringify(updated));
  };

  const updateField = (field: keyof ResumeData, value: unknown) => {
    save({ ...data, [field]: value });
  };

  const updateEdu = (i: number, field: string, value: string) => {
    const edu = [...data.education];
    edu[i] = { ...edu[i], [field]: value };
    save({ ...data, education: edu });
  };

  const addEdu = () => save({ ...data, education: [...data.education, { degree: '', institute: '', year: '', percentage: '' }] });
  const removeEdu = (i: number) => save({ ...data, education: data.education.filter((_, idx) => idx !== i) });

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    if (!previewRef.current) return;

    setPreview(true);
    setTimeout(async () => {
      const canvas = await html2canvas(previewRef.current!, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Watermark
      pdf.setFontSize(10);
      pdf.setTextColor(180, 180, 180);
      pdf.text('Er. Sangam Krishna | Rozgar Sathi', pdfWidth / 2, pdfHeight - 5, { align: 'center' });

      pdf.save(`${data.name || 'resume'}_RozgarSathi.pdf`);
    }, 300);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-hindi";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-hindi";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-hindi">
          📄 {t('Resume Builder', 'रिज्यूमे बनाएं')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-hindi text-sm">
          {t('Fill details below and download professional PDF resume with watermark.', 'नीचे जानकारी भरें और वॉटरमार्क के साथ प्रोफेशनल पीडीएफ रिज्यूमे डाउनलोड करें।')}
        </p>
      </div>

      <AdBanner slot="4444444444" format="horizontal" className="mb-6 rounded-xl" />

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 font-hindi">
            👤 {t('Personal Information', 'व्यक्तिगत जानकारी')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: 'name', label: t('Full Name', 'पूरा नाम'), placeholder: t('Your full name', 'आपका पूरा नाम') },
              { field: 'fatherName', label: t("Father's Name", 'पिता का नाम'), placeholder: '' },
              { field: 'dob', label: t('Date of Birth', 'जन्म तिथि'), placeholder: 'DD/MM/YYYY' },
              { field: 'category', label: t('Category', 'श्रेणी'), placeholder: t('General / OBC / SC / ST', 'सामान्य / ओबीसी / एससी / एसटी') },
              { field: 'phone', label: t('Mobile Number', 'मोबाइल नंबर'), placeholder: '10-digit number' },
              { field: 'email', label: t('Email', 'ईमेल'), placeholder: 'example@email.com' },
            ].map(f => (
              <div key={f.field}>
                <label className={labelClass}>{f.label}</label>
                <input
                  type="text"
                  value={(data as unknown as Record<string, string>)[f.field]}
                  onChange={e => updateField(f.field as keyof ResumeData, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t('Address', 'पता')}</label>
              <textarea
                value={data.address}
                onChange={e => updateField('address', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder={t('Village/City, District, State, PIN', 'गांव/शहर, जिला, राज्य, पिन')}
              />
            </div>
          </div>
        </section>

        {/* Objective */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 font-hindi">
            🎯 {t('Career Objective', 'करियर उद्देश्य')}
          </h2>
          <textarea
            value={data.objective}
            onChange={e => updateField('objective', e.target.value)}
            rows={3}
            className={inputClass}
            placeholder={t(
              'To serve the nation through a government position and contribute to public welfare...',
              'सरकारी पद के माध्यम से राष्ट्र की सेवा करना और जन कल्याण में योगदान देना...'
            )}
          />
        </section>

        {/* Education */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white font-hindi">
              🎓 {t('Education', 'शिक्षा')}
            </h2>
            <button onClick={addEdu} className="text-sm text-primary-600 hover:text-primary-700 font-hindi">
              + {t('Add', 'जोड़ें')}
            </button>
          </div>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {[
                  { field: 'degree', placeholder: t('Degree (B.A., 12th...)', 'डिग्री (बी.ए., 12वीं...)') },
                  { field: 'institute', placeholder: t('School/College', 'स्कूल/कॉलेज') },
                  { field: 'year', placeholder: t('Year', 'वर्ष') },
                  { field: 'percentage', placeholder: t('% / CGPA', '% / सीजीपीए') },
                ].map(f => (
                  <input
                    key={f.field}
                    type="text"
                    value={(edu as Record<string, string>)[f.field]}
                    onChange={e => updateEdu(i, f.field, e.target.value)}
                    placeholder={f.placeholder}
                    className={inputClass}
                  />
                ))}
                {data.education.length > 1 && (
                  <button onClick={() => removeEdu(i)} className="text-red-400 text-xs col-span-2 sm:col-span-4 text-right">
                    {t('Remove', 'हटाएं')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Languages */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 font-hindi">
            💡 {t('Skills & Languages', 'कौशल और भाषाएं')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('Skills', 'कौशल')}</label>
              <input
                type="text"
                value={data.skills}
                onChange={e => updateField('skills', e.target.value)}
                placeholder={t('MS Office, Typing, Tally...', 'एमएस ऑफिस, टाइपिंग, टैली...')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('Languages Known', 'ज्ञात भाषाएं')}</label>
              <input
                type="text"
                value={data.languages}
                onChange={e => updateField('languages', e.target.value)}
                placeholder="Hindi, English, Bhojpuri..."
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>{t('Hobbies', 'शौक')}</label>
              <input
                type="text"
                value={data.hobbies}
                onChange={e => updateField('hobbies', e.target.value)}
                placeholder={t('Reading, Cricket, Social Service...', 'पढ़ना, क्रिकेट, सामाजिक सेवा...')}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex-1 sm:flex-none px-6 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-hindi"
          >
            {preview ? t('✏️ Edit', '✏️ संपादित करें') : t('👁️ Preview', '👁️ पूर्वावलोकन')}
          </button>
          <button
            onClick={downloadPDF}
            className="flex-1 sm:flex-none px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors font-hindi"
          >
            📥 {t('Download PDF', 'पीडीएफ डाउनलोड करें')}
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      {preview && (
        <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
          <div ref={previewRef} className="bg-white text-gray-900 p-8 max-w-2xl mx-auto font-sans text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-wide">{data.name || 'Your Name'}</h1>
              <p className="text-gray-600 mt-1">{data.address}</p>
              <p className="text-gray-600">📞 {data.phone} | ✉️ {data.email}</p>
            </div>

            {/* Objective */}
            {data.objective && (
              <div className="mb-4">
                <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Career Objective</h2>
                <p className="text-gray-700 leading-relaxed">{data.objective}</p>
              </div>
            )}

            {/* Personal Details */}
            <div className="mb-4">
              <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Personal Details</h2>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Father's Name", data.fatherName],
                    ["Date of Birth", data.dob],
                    ["Category", data.category],
                    ["Languages", data.languages],
                  ].map(([k, v]) => v ? (
                    <tr key={k}>
                      <td className="py-0.5 font-medium w-40">{k}</td>
                      <td className="py-0.5">: {v}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>

            {/* Education */}
            <div className="mb-4">
              <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Educational Qualification</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left">Degree</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Institute</th>
                    <th className="border border-gray-300 px-2 py-1">Year</th>
                    <th className="border border-gray-300 px-2 py-1">%/CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {data.education.map((e, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 px-2 py-1">{e.degree}</td>
                      <td className="border border-gray-300 px-2 py-1">{e.institute}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{e.year}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{e.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Skills */}
            {data.skills && (
              <div className="mb-4">
                <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Skills</h2>
                <p>{data.skills}</p>
              </div>
            )}

            {/* Hobbies */}
            {data.hobbies && (
              <div className="mb-4">
                <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Hobbies & Interests</h2>
                <p>{data.hobbies}</p>
              </div>
            )}

            {/* Declaration */}
            <div className="mb-4">
              <h2 className="font-bold uppercase text-sm border-b border-gray-400 pb-1 mb-2">Declaration</h2>
              <p className="text-gray-700 text-xs">I hereby declare that all the information given above is true and correct to the best of my knowledge and belief.</p>
            </div>

            {/* Signature */}
            <div className="flex justify-between mt-6 text-sm">
              <div>
                <p>Date: ___________</p>
                <p>Place: ___________</p>
              </div>
              <div className="text-right">
                <p className="mt-6">___________________</p>
                <p className="font-medium">{data.name}</p>
                <p className="text-gray-500 text-xs">(Signature)</p>
              </div>
            </div>

            {/* Watermark */}
            <div className="text-center mt-4 pt-2 border-t border-gray-200 text-xs text-gray-400">
              Er. Sangam Krishna | Rozgar Sathi
            </div>
          </div>
        </div>
      )}

      <AdBanner slot="5555555555" format="horizontal" className="mt-8 rounded-xl" />
    </main>
  );
}
