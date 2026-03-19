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
  const title = getString(record, 'title');
  const titleHi = getString(record, 'titleHi', 'title_hi') || title;

  if (!title && !titleHi) {
    return null;
  }

  const organization = getString(record, 'organization');
  const organizationHi = getString(record, 'organizationHi', 'organization_hi') || organization;
  const category = getValidatedCategory(getString(record, 'category'));
  const status = getValidatedStatus(getString(record, 'status'));
  const selectionProcess = splitPipeList(getString(record, 'selectionProcess', 'selection_process'));
  const selectionProcessHi = splitPipeList(getString(record, 'selectionProcessHi', 'selection_process_hi'));
  const tags = splitPipeList(getString(record, 'tags'));
  const resultDate = getString(record, 'resultDate', 'result_date');
  const syllabus = getString(record, 'syllabus');
  const syllabusHi = getString(record, 'syllabusHi', 'syllabus_hi');

  return {
    id: getString(record, 'id') || slugify(title || titleHi),
    title,
    titleHi,
    organization,
    organizationHi,
    category,
    totalPosts: getNumber(record, 'totalPosts', 'total_posts'),
    eligibility: {
      education: getString(record, 'education'),
      educationHi: getString(record, 'educationHi', 'education_hi') || getString(record, 'education'),
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
      applyEnd: getString(record, 'applyEnd', 'apply_end'),
      examDate: getString(record, 'examDate', 'exam_date'),
      ...(resultDate ? { resultDate } : {}),
    },
    salary: getString(record, 'salary'),
    salaryHi: getString(record, 'salaryHi', 'salary_hi') || getString(record, 'salary'),
    applyLink: getString(record, 'applyLink', 'apply_link'),
    notificationLink: getString(record, 'notificationLink', 'notification_link'),
    status,
    tags,
    description: getString(record, 'description'),
    descriptionHi: getString(record, 'descriptionHi', 'description_hi') || getString(record, 'description'),
    ...(syllabus ? { syllabus } : {}),
    ...(syllabusHi ? { syllabusHi } : {}),
    selectionProcess,
    selectionProcessHi: selectionProcessHi.length > 0 ? selectionProcessHi : selectionProcess,
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
