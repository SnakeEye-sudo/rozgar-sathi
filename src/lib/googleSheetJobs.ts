import { JOBS, Job, JobCategory, JobStatus } from './jobData';

const ROZGAR_SHEET_ID = '1T0hSB1vasRo6oAoOVKz5UJn8jlgb82aMHhwz1S3yMmQ';
const ROZGAR_SHEET_NAME = 'Sheet1';
const REQUEST_TIMEOUT_MS = 10000;

interface GoogleSheetColumn {
  label?: string;
}

interface GoogleSheetCell {
  v?: string | number | boolean | null;
  f?: string | null;
}

interface GoogleSheetRow {
  c: Array<GoogleSheetCell | null>;
}

interface GoogleSheetResponse {
  status: string;
  table?: {
    cols: GoogleSheetColumn[];
    rows: GoogleSheetRow[];
  };
}

export type JobDataSource = 'google-sheet' | 'fallback';

export interface JobDataResult {
  jobs: Job[];
  source: JobDataSource;
}

const JOB_CATEGORIES: JobCategory[] = [
  'railway',
  'ssc',
  'banking',
  'upsc',
  'bpsc',
  'state_psc',
  'defence',
  'teaching',
  'police',
  'other',
];

const JOB_STATUSES: JobStatus[] = ['active', 'upcoming', 'result', 'admit_card'];

const normalizeHeader = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

const getSheetUrl = () =>
  `https://docs.google.com/spreadsheets/d/${ROZGAR_SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(ROZGAR_SHEET_NAME)}`;

const normalizeText = (value: unknown) => String(value ?? '').trim();

const splitPipeList = (value: string) => value.split('|').map(item => item.trim()).filter(Boolean);

const keywordCategoryMap: Array<{ keywords: string[]; category: JobCategory }> = [
  { keywords: ['railway', 'rrb', 'loco'], category: 'railway' },
  { keywords: ['ssc', 'constable', 'chsl', 'cgl'], category: 'ssc' },
  { keywords: ['bank', 'ibps', 'sbi', 'clerk', 'po'], category: 'banking' },
  { keywords: ['upsc', 'civil services', 'ifos'], category: 'upsc' },
  { keywords: ['bpsc'], category: 'bpsc' },
  { keywords: ['army', 'air force', 'navy', 'agniveer', 'defence', 'drdo'], category: 'defence' },
  { keywords: ['teacher', 'teaching', 'faculty'], category: 'teaching' },
  { keywords: ['police'], category: 'police' },
  { keywords: ['psc', 'public service commission'], category: 'state_psc' },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `job-${Date.now()}`;

const getValidatedCategory = (value: string): JobCategory =>
  JOB_CATEGORIES.includes(value as JobCategory) ? (value as JobCategory) : 'other';

const getValidatedStatus = (value: string): JobStatus =>
  JOB_STATUSES.includes(value as JobStatus) ? (value as JobStatus) : 'active';

const inferCategory = (...values: string[]): JobCategory => {
  const haystack = values.join(' ').toLowerCase();
  const match = keywordCategoryMap.find(entry => entry.keywords.some(keyword => haystack.includes(keyword)));
  return match?.category ?? 'other';
};

const cleanLinkValue = (value: string) => {
  if (!value || value === '[URL]' || value === 'url') {
    return '';
  }
  return value;
};

const loadGoogleSheet = async (): Promise<GoogleSheetResponse> => {
  if (typeof window === 'undefined' || !document.body) {
    throw new Error('Google Sheet loader requires a browser context.');
  }

  return new Promise((resolve, reject) => {
    const callbackName = `__rozgarSheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const win = window as unknown as Record<string, unknown>;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      delete win[callbackName];
      script.remove();
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('Rozgar Google Sheet request timed out.'));
    }, REQUEST_TIMEOUT_MS);

    win[callbackName] = (payload: GoogleSheetResponse) => {
      cleanup();
      if (payload.status !== 'ok' || !payload.table) {
        reject(new Error('Rozgar Google Sheet returned an invalid response.'));
        return;
      }
      resolve(payload);
    };

    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error('Rozgar Google Sheet script could not be loaded.'));
    };
    script.src = `${getSheetUrl()}&tqx=out:json;responseHandler:${callbackName}&ts=${Date.now()}`;
    document.body.appendChild(script);
  });
};

const getCellValue = (cell: GoogleSheetCell | null | undefined) => {
  if (!cell) return '';
  if (typeof cell.v === 'number') return cell.v;
  if (typeof cell.v === 'boolean') return cell.v ? 'true' : 'false';
  return normalizeText(cell.v ?? cell.f ?? '');
};

const buildRowRecord = (headers: string[], row: GoogleSheetRow) => {
  const record: Record<string, string | number> = {};

  headers.forEach((header, index) => {
    if (!header) return;
    const value = getCellValue(row.c[index]);
    if (value === '') return;
    record[header] = value;
  });

  return record;
};

const getString = (record: Record<string, string | number>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[normalizeHeader(key)];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
};

const getNumber = (record: Record<string, string | number>, ...keys: string[]) => {
  const raw = getString(record, ...keys);
  if (!raw) return 0;
  const parsed = Number(String(raw).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapRecordToJob = (record: Record<string, string | number>): Job | null => {
  const title = getString(record, 'title', 'postName', 'post_name');
  const titleHi = getString(record, 'titleHi', 'title_hi') || title;

  if (!title && !titleHi) {
    return null;
  }

  const organization = getString(record, 'organization', 'departmentOrganization', 'department_organization');
  const organizationHi = getString(record, 'organizationHi', 'organization_hi') || organization;
  const categoryRaw = getString(record, 'category');
  const category = categoryRaw
    ? getValidatedCategory(categoryRaw)
    : inferCategory(organization, title);
  const status = getValidatedStatus(getString(record, 'status'));
  const selectionProcess = splitPipeList(getString(record, 'selectionProcess', 'selection_process'));
  const selectionProcessHi = splitPipeList(getString(record, 'selectionProcessHi', 'selection_process_hi'));
  const tags = splitPipeList(getString(record, 'tags'));
  const resultDate = getString(record, 'resultDate', 'result_date');
  const syllabus = getString(record, 'syllabus');
  const syllabusHi = getString(record, 'syllabusHi', 'syllabus_hi');
  const qualification = getString(record, 'education', 'qualification');
  const totalPosts = getNumber(record, 'totalPosts', 'total_posts', 'totalVacancies', 'total_vacancies');
  const applyEnd = getString(record, 'applyEnd', 'apply_end', 'lastDateToApply', 'last_date_to_apply');
  const applyLink = cleanLinkValue(getString(record, 'applyLink', 'apply_link', 'applicationLink', 'application_link'));
  const defaultTags = [organization, title, category].map(value => value.toLowerCase()).filter(Boolean);

  return {
    id: getString(record, 'id') || slugify(title || titleHi),
    title,
    titleHi,
    organization,
    organizationHi,
    category,
    totalPosts,
    eligibility: {
      education: qualification,
      educationHi: getString(record, 'educationHi', 'education_hi') || qualification,
      age: getString(record, 'age'),
      ageHi: getString(record, 'ageHi', 'age_hi') || getString(record, 'age'),
    },
    fees: {
      general: getNumber(record, 'feeGeneral', 'generalFee', 'general_fee'),
      obc: getNumber(record, 'feeObc', 'obcFee', 'obc_fee'),
      sc_st: getNumber(record, 'feeScSt', 'scStFee', 'sc_st_fee'),
      female: getNumber(record, 'feeFemale', 'femaleFee', 'female_fee'),
    },
    importantDates: {
      notificationDate: getString(record, 'notificationDate', 'notification_date'),
      applyStart: getString(record, 'applyStart', 'apply_start'),
      applyEnd,
      examDate: getString(record, 'examDate', 'exam_date'),
      ...(resultDate ? { resultDate } : {}),
    },
    salary: getString(record, 'salary'),
    salaryHi: getString(record, 'salaryHi', 'salary_hi') || getString(record, 'salary'),
    applyLink,
    notificationLink: cleanLinkValue(getString(record, 'notificationLink', 'notification_link')) || applyLink,
    status,
    tags: tags.length > 0 ? tags : Array.from(new Set(defaultTags)),
    description: getString(record, 'description') || `${title} recruitment by ${organization}.`,
    descriptionHi: getString(record, 'descriptionHi', 'description_hi') || getString(record, 'description') || `${titleHi || title} recruitment.`,
    ...(syllabus ? { syllabus } : {}),
    ...(syllabusHi ? { syllabusHi } : {}),
    selectionProcess: selectionProcess.length > 0 ? selectionProcess : ['Application Review'],
    selectionProcessHi: selectionProcessHi.length > 0 ? selectionProcessHi : (selectionProcess.length > 0 ? selectionProcess : ['Application Review']),
  };
};

export const fetchJobsFromGoogleSheet = async (): Promise<Job[]> => {
  const response = await loadGoogleSheet();
  const headers = response.table?.cols.map(col => normalizeHeader(col.label || '')) ?? [];

  if (headers.every(header => !header)) {
    return [];
  }

  return (response.table?.rows ?? [])
    .map(row => buildRowRecord(headers, row))
    .map(mapRecordToJob)
    .filter((job): job is Job => job !== null);
};

export const loadJobs = async (): Promise<JobDataResult> => {
  try {
    const jobs = await fetchJobsFromGoogleSheet();
    if (jobs.length > 0) {
      return { jobs, source: 'google-sheet' };
    }
  } catch (error) {
    console.error('Rozgar Sathi Google Sheet sync failed:', error);
  }

  return { jobs: JOBS, source: 'fallback' };
};
