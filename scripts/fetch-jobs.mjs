/**
 * Rozgar Sathi — Automated Job Fetcher
 * Runs via GitHub Actions daily at 2 AM IST
 * API key is NEVER hardcoded — always from environment variable
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JOBS_FILE = join(__dirname, '../src/lib/jobData.ts');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY not set'); process.exit(1);
}

const MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free', // free, try first
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct',       // $0.02/1M tokens — ~$0.00004/day fallback
  'mistralai/mistral-nemo',                  // $0.02/1M tokens fallback
];

async function callOpenRouter(prompt, idx = 0) {
  if (idx >= MODELS.length) throw new Error('All models failed');
  console.log(`Trying: ${MODELS[idx]}`);
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://snakeeye-sudo.github.io/rozgar-sathi/',
      'X-Title': 'Rozgar Sathi',
    },
    body: JSON.stringify({
      model: MODELS[idx],
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 8000,
    }),
  });
  if (!res.ok) { console.warn(`Model failed (${res.status})`); return callOpenRouter(prompt, idx + 1); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

const TODAY = new Date().toISOString().split('T')[0];

const PROMPT = `You are an expert on Indian government job recruitment. Today is ${TODAY}.

Research and return the top 20 most important CURRENT Indian government job vacancies (2024-2026 notifications only).

Cover ALL these categories:
- Railway: RRB NTPC, RRB Group D, RRC, RPF
- SSC: CGL, CHSL, MTS, CPO, JE, Steno, GD Constable
- Banking: IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B, NABARD
- UPSC: Civil Services, CDS, NDA, CAPF, CISF, IES
- BPSC: 70th CCE, BPSC Teacher, BPSC TRE, Bihar Police
- State PSC: UPPSC PCS, MPPSC, RPSC RAS, JPSC, WBPSC, TNPSC Group 2
- Defence: Indian Army, Navy, Air Force, CRPF, BSF, CISF, SSB, Coast Guard
- Teaching: CTET, DSSSB, KVS, NVS, UPTET, Bihar STET
- Police: Delhi Police, UP Police, Bihar Police, SSC CPO, CISF
- Other: DRDO, ISRO, HAL, BEL, ONGC, Coal India, FCI, India Post, LIC

Return ONLY a valid JSON array. No markdown. No explanation. Just the array:

[{"id":"unique-id-2025","title":"English title","titleHi":"हिंदी शीर्षक","organization":"Org Name","organizationHi":"संगठन नाम","category":"railway|ssc|banking|upsc|bpsc|state_psc|defence|teaching|police|other","totalPosts":1234,"eligibility":{"education":"Qualification","educationHi":"योग्यता","age":"18-32 years","ageHi":"18-32 वर्ष"},"fees":{"general":500,"obc":500,"sc_st":250,"female":250},"importantDates":{"notificationDate":"YYYY-MM-DD","applyStart":"YYYY-MM-DD","applyEnd":"YYYY-MM-DD","examDate":"YYYY-MM-DD","resultDate":""},"salary":"₹35,400 - ₹1,12,400 per month","salaryHi":"₹35,400 - ₹1,12,400 प्रति माह","applyLink":"https://official.gov.in","notificationLink":"https://official.gov.in/notification.pdf","status":"active|upcoming|result|admit_card","tags":["tag1","tag2"],"description":"2-3 sentences in English.","descriptionHi":"2-3 वाक्य हिंदी में।","selectionProcess":["Step 1","Step 2"],"selectionProcessHi":["चरण 1","चरण 2"]}]

Rules:
- ONLY real vacancies with official notifications
- Use real official URLs (ssc.gov.in, rrbapply.gov.in, ibps.in, upsc.gov.in, bpsc.bih.nic.in etc.)
- totalPosts and all fees must be numbers not strings
- Include minimum 3 BPSC/Bihar vacancies
- Return ONLY the JSON array`;

function extractJSON(text) {
  const match = text.match(/\[[\s\S]*\]/);
  return match ? match[0] : text.trim();
}

function validate(job) {
  const req = ['id','title','titleHi','organization','category','totalPosts','eligibility','fees','importantDates','salary','applyLink','status'];
  if (req.some(f => !job[f])) return false;
  const cats = ['railway','ssc','banking','upsc','bpsc','state_psc','defence','teaching','police','other'];
  if (!cats.includes(job.category)) return false;
  if (typeof job.totalPosts !== 'number') job.totalPosts = parseInt(job.totalPosts) || 0;
  // ensure fees are numbers
  for (const k of ['general','obc','sc_st','female']) {
    if (typeof job.fees[k] !== 'number') job.fees[k] = parseInt(job.fees[k]) || 0;
  }
  // ensure arrays exist
  if (!Array.isArray(job.selectionProcess)) job.selectionProcess = [];
  if (!Array.isArray(job.selectionProcessHi)) job.selectionProcessHi = [];
  if (!Array.isArray(job.tags)) job.tags = [];
  if (!job.organizationHi) job.organizationHi = job.organization;
  if (!job.notificationLink) job.notificationLink = job.applyLink;
  if (!job.descriptionHi) job.descriptionHi = job.description || '';
  return true;
}

function buildTS(jobs) {
  return `export type JobCategory = 'railway' | 'ssc' | 'banking' | 'upsc' | 'bpsc' | 'state_psc' | 'defence' | 'teaching' | 'police' | 'other';
export type JobStatus = 'active' | 'upcoming' | 'result' | 'admit_card';

export interface Job {
  id: string; title: string; titleHi: string;
  organization: string; organizationHi: string;
  category: JobCategory; totalPosts: number;
  eligibility: { education: string; educationHi: string; age: string; ageHi: string; };
  fees: { general: number; obc: number; sc_st: number; female: number; };
  importantDates: { notificationDate: string; applyStart: string; applyEnd: string; examDate: string; resultDate?: string; };
  salary: string; salaryHi: string;
  applyLink: string; notificationLink: string;
  status: JobStatus; tags: string[];
  description: string; descriptionHi: string;
  syllabus?: string; syllabusHi?: string;
  selectionProcess: string[]; selectionProcessHi: string[];
}

// Auto-generated by GitHub Actions — ${new Date().toISOString()}
// DO NOT edit manually
export const JOBS: Job[] = ${JSON.stringify(jobs, null, 2)};

export const CATEGORIES = [
  { id: 'all', label: 'All Jobs', labelHi: 'सभी नौकरियां', icon: '🏛️' },
  { id: 'railway', label: 'Railway', labelHi: 'रेलवे', icon: '🚂' },
  { id: 'ssc', label: 'SSC', labelHi: 'एसएससी', icon: '📋' },
  { id: 'banking', label: 'Banking', labelHi: 'बैंकिंग', icon: '🏦' },
  { id: 'upsc', label: 'UPSC', labelHi: 'यूपीएससी', icon: '⭐' },
  { id: 'bpsc', label: 'BPSC', labelHi: 'बीपीएससी', icon: '🎯' },
  { id: 'state_psc', label: 'State PSC', labelHi: 'राज्य पीएससी', icon: '🗺️' },
  { id: 'defence', label: 'Defence', labelHi: 'रक्षा', icon: '🪖' },
  { id: 'teaching', label: 'Teaching', labelHi: 'शिक्षण', icon: '📚' },
  { id: 'police', label: 'Police', labelHi: 'पुलिस', icon: '👮' },
  { id: 'other', label: 'Other', labelHi: 'अन्य', icon: '🏢' },
];

export const STATUS_CONFIG = {
  active: { label: 'Apply Now', labelHi: 'अभी आवेदन करें', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  upcoming: { label: 'Upcoming', labelHi: 'आने वाला', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  result: { label: 'Result Out', labelHi: 'परिणाम आया', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  admit_card: { label: 'Admit Card', labelHi: 'एडमिट कार्ड', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
};
`;
}

async function main() {
  console.log(`Rozgar Sathi Job Fetcher — ${TODAY}`);
  try {
    const raw = await callOpenRouter(PROMPT);
    const jobs = JSON.parse(extractJSON(raw)).filter(validate);
    console.log(`Valid jobs: ${jobs.length}`);
    if (jobs.length < 5) throw new Error(`Only ${jobs.length} valid jobs — too few`);
    writeFileSync(JOBS_FILE, buildTS(jobs), 'utf-8');
    console.log(`jobData.ts updated with ${jobs.length} jobs`);
    console.log('Categories:', [...new Set(jobs.map(j => j.category))].join(', '));
  } catch (err) {
    console.error('Fetch failed:', err.message);
    console.log('Keeping existing jobData.ts');
    process.exit(0); // exit 0 so workflow doesn't fail
  }
}

main();
