export type JobCategory = 'railway' | 'ssc' | 'banking' | 'upsc' | 'bpsc' | 'state_psc' | 'defence' | 'teaching' | 'police' | 'other';
export type JobStatus = 'active' | 'upcoming' | 'result' | 'admit_card';

export interface Job {
  id: string;
  title: string;
  titleHi: string;
  organization: string;
  organizationHi: string;
  category: JobCategory;
  totalPosts: number;
  eligibility: {
    education: string;
    educationHi: string;
    age: string;
    ageHi: string;
  };
  fees: {
    general: number;
    obc: number;
    sc_st: number;
    female: number;
  };
  importantDates: {
    notificationDate: string;
    applyStart: string;
    applyEnd: string;
    examDate: string;
    resultDate?: string;
  };
  salary: string;
  salaryHi: string;
  applyLink: string;
  notificationLink: string;
  status: JobStatus;
  tags: string[];
  description: string;
  descriptionHi: string;
  syllabus?: string;
  syllabusHi?: string;
  selectionProcess: string[];
  selectionProcessHi: string[];
}

export const JOBS: Job[] = [
  {
    id: 'rrc-ntpc-2025',
    title: 'RRC NTPC Graduate Level 2025',
    titleHi: 'आरआरसी एनटीपीसी ग्रेजुएट लेवल 2025',
    organization: 'Railway Recruitment Board',
    organizationHi: 'रेलवे भर्ती बोर्ड',
    category: 'railway',
    totalPosts: 11558,
    eligibility: {
      education: 'Graduate in any discipline from recognized university',
      educationHi: 'किसी मान्यता प्राप्त विश्वविद्यालय से किसी भी विषय में स्नातक',
      age: '18-36 years (relaxation as per rules)',
      ageHi: '18-36 वर्ष (नियमानुसार छूट)',
    },
    fees: { general: 500, obc: 500, sc_st: 250, female: 250 },
    importantDates: {
      notificationDate: '2025-09-01',
      applyStart: '2025-09-14',
      applyEnd: '2025-10-13',
      examDate: '2026-01-15',
    },
    salary: '₹19,900 - ₹92,300 per month',
    salaryHi: '₹19,900 - ₹92,300 प्रति माह',
    applyLink: 'https://www.rrbapply.gov.in',
    notificationLink: 'https://indianrailways.gov.in',
    status: 'active',
    tags: ['railway', 'graduate', 'central govt', 'group b', 'group c'],
    description: 'Railway Recruitment Board is recruiting for Non-Technical Popular Categories (NTPC) posts including Junior Clerk cum Typist, Accounts Clerk cum Typist, Junior Time Keeper, Trains Clerk, Commercial cum Ticket Clerk, Station Master, Goods Guard, Senior Commercial cum Ticket Clerk.',
    descriptionHi: 'रेलवे भर्ती बोर्ड गैर-तकनीकी लोकप्रिय श्रेणियों (एनटीपीसी) के पदों के लिए भर्ती कर रहा है जिसमें जूनियर क्लर्क कम टाइपिस्ट, अकाउंट्स क्लर्क, स्टेशन मास्टर, गुड्स गार्ड आदि शामिल हैं।',
    selectionProcess: ['CBT Stage 1', 'CBT Stage 2', 'Typing Skill Test / CBAT', 'Document Verification', 'Medical Examination'],
    selectionProcessHi: ['सीबीटी चरण 1', 'सीबीटी चरण 2', 'टाइपिंग / सीबीएटी', 'दस्तावेज़ सत्यापन', 'चिकित्सा परीक्षा'],
  },
  {
    id: 'ssc-cgl-2025',
    title: 'SSC CGL 2025',
    titleHi: 'एसएससी सीजीएल 2025',
    organization: 'Staff Selection Commission',
    organizationHi: 'कर्मचारी चयन आयोग',
    category: 'ssc',
    totalPosts: 17727,
    eligibility: {
      education: "Bachelor's degree from any recognized university",
      educationHi: 'किसी मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री',
      age: '18-32 years (post-wise, relaxation applicable)',
      ageHi: '18-32 वर्ष (पद अनुसार, छूट लागू)',
    },
    fees: { general: 100, obc: 100, sc_st: 0, female: 0 },
    importantDates: {
      notificationDate: '2025-06-09',
      applyStart: '2025-06-09',
      applyEnd: '2025-07-07',
      examDate: '2025-09-13',
    },
    salary: '₹25,500 - ₹1,51,100 per month',
    salaryHi: '₹25,500 - ₹1,51,100 प्रति माह',
    applyLink: 'https://ssc.gov.in',
    notificationLink: 'https://ssc.gov.in/notices',
    status: 'result',
    tags: ['ssc', 'central govt', 'graduate', 'group b', 'income tax', 'cbi'],
    description: 'SSC CGL recruits for Group B and Group C posts in various Central Government Ministries, Departments and Organisations. Posts include Inspector Income Tax, Inspector (Central Excise), Assistant Section Officer, Sub Inspector CBI, etc.',
    descriptionHi: 'एसएससी सीजीएल विभिन्न केंद्र सरकार के मंत्रालयों में ग्रुप बी और ग्रुप सी पदों के लिए भर्ती करता है। पदों में इंस्पेक्टर इनकम टैक्स, असिस्टेंट सेक्शन ऑफिसर, सब इंस्पेक्टर सीबीआई आदि शामिल हैं।',
    selectionProcess: ['Tier 1 (CBE)', 'Tier 2 (CBE)', 'Document Verification'],
    selectionProcessHi: ['टियर 1 (सीबीई)', 'टियर 2 (सीबीई)', 'दस्तावेज़ सत्यापन'],
  },
  {
    id: 'ibps-po-2025',
    title: 'IBPS PO 2025',
    titleHi: 'आईबीपीएस पीओ 2025',
    organization: 'Institute of Banking Personnel Selection',
    organizationHi: 'बैंकिंग कार्मिक चयन संस्थान',
    category: 'banking',
    totalPosts: 4455,
    eligibility: {
      education: "Bachelor's degree in any discipline",
      educationHi: 'किसी भी विषय में स्नातक डिग्री',
      age: '20-30 years',
      ageHi: '20-30 वर्ष',
    },
    fees: { general: 850, obc: 850, sc_st: 175, female: 175 },
    importantDates: {
      notificationDate: '2025-07-01',
      applyStart: '2025-07-01',
      applyEnd: '2025-07-21',
      examDate: '2025-10-04',
    },
    salary: '₹41,960 - ₹89,890 per month (with allowances)',
    salaryHi: '₹41,960 - ₹89,890 प्रति माह (भत्तों सहित)',
    applyLink: 'https://ibps.in',
    notificationLink: 'https://ibps.in/crp-po-mt-xv/',
    status: 'upcoming',
    tags: ['banking', 'ibps', 'probationary officer', 'graduate'],
    description: 'IBPS PO recruits Probationary Officers for public sector banks including Bank of Baroda, Canara Bank, Indian Bank, Punjab National Bank, Union Bank of India, etc.',
    descriptionHi: 'आईबीपीएस पीओ सार्वजनिक क्षेत्र के बैंकों जैसे बैंक ऑफ बड़ौदा, केनरा बैंक, इंडियन बैंक, पंजाब नेशनल बैंक आदि के लिए प्रोबेशनरी ऑफिसर की भर्ती करता है।',
    selectionProcess: ['Prelims', 'Mains', 'Interview', 'Document Verification'],
    selectionProcessHi: ['प्रारंभिक परीक्षा', 'मुख्य परीक्षा', 'साक्षात्कार', 'दस्तावेज़ सत्यापन'],
  },
  {
    id: 'bpsc-70th-2025',
    title: 'BPSC 70th Combined Competitive Exam',
    titleHi: 'बीपीएससी 70वीं संयुक्त प्रतियोगिता परीक्षा',
    organization: 'Bihar Public Service Commission',
    organizationHi: 'बिहार लोक सेवा आयोग',
    category: 'bpsc',
    totalPosts: 1929,
    eligibility: {
      education: "Bachelor's degree from recognized university",
      educationHi: 'मान्यता प्राप्त विश्वविद्यालय से स्नातक',
      age: '20-37 years (relaxation for reserved categories)',
      ageHi: '20-37 वर्ष (आरक्षित वर्गों को छूट)',
    },
    fees: { general: 600, obc: 600, sc_st: 150, female: 150 },
    importantDates: {
      notificationDate: '2024-09-28',
      applyStart: '2024-10-01',
      applyEnd: '2024-10-28',
      examDate: '2024-12-13',
      resultDate: '2025-04-10',
    },
    salary: '₹56,100 - ₹1,77,500 per month',
    salaryHi: '₹56,100 - ₹1,77,500 प्रति माह',
    applyLink: 'https://bpsc.bih.nic.in',
    notificationLink: 'https://bpsc.bih.nic.in/Advt/advt_70_cce.pdf',
    status: 'result',
    tags: ['bpsc', 'bihar', 'state psc', 'sdo', 'dsp', 'bdo'],
    description: 'BPSC 70th CCE recruits for various Group A and Group B posts in Bihar Government including SDO, DSP, BDO, Supply Inspector, Block SC & ST Welfare Officer, etc.',
    descriptionHi: 'बीपीएससी 70वीं सीसीई बिहार सरकार में विभिन्न ग्रुप ए और ग्रुप बी पदों के लिए भर्ती करती है जिसमें एसडीओ, डीएसपी, बीडीओ, सप्लाई इंस्पेक्टर आदि शामिल हैं।',
    selectionProcess: ['Prelims (PT)', 'Mains (Written)', 'Interview'],
    selectionProcessHi: ['प्रारंभिक परीक्षा', 'मुख्य परीक्षा', 'साक्षात्कार'],
  },
  {
    id: 'upsc-cse-2026',
    title: 'UPSC Civil Services Exam 2026',
    titleHi: 'यूपीएससी सिविल सेवा परीक्षा 2026',
    organization: 'Union Public Service Commission',
    organizationHi: 'संघ लोक सेवा आयोग',
    category: 'upsc',
    totalPosts: 979,
    eligibility: {
      education: "Bachelor's degree from any recognized university",
      educationHi: 'किसी मान्यता प्राप्त विश्वविद्यालय से स्नातक',
      age: '21-32 years (OBC: 35, SC/ST: 37)',
      ageHi: '21-32 वर्ष (ओबीसी: 35, एससी/एसटी: 37)',
    },
    fees: { general: 100, obc: 100, sc_st: 0, female: 0 },
    importantDates: {
      notificationDate: '2026-01-22',
      applyStart: '2026-01-22',
      applyEnd: '2026-02-11',
      examDate: '2026-05-24',
    },
    salary: '₹56,100 - ₹2,50,000 per month (IAS/IPS/IFS)',
    salaryHi: '₹56,100 - ₹2,50,000 प्रति माह (आईएएस/आईपीएस/आईएफएस)',
    applyLink: 'https://upsconline.nic.in',
    notificationLink: 'https://upsc.gov.in',
    status: 'active',
    tags: ['upsc', 'ias', 'ips', 'ifs', 'central govt', 'all india services'],
    description: 'UPSC CSE is the most prestigious exam in India recruiting for IAS, IPS, IFS and other Central Services. Conducted in three stages: Prelims, Mains, and Personality Test (Interview).',
    descriptionHi: 'यूपीएससी सीएसई भारत की सबसे प्रतिष्ठित परीक्षा है जो आईएएस, आईपीएस, आईएफएस और अन्य केंद्रीय सेवाओं के लिए भर्ती करती है। तीन चरणों में आयोजित: प्रारंभिक, मुख्य और व्यक्तित्व परीक्षण।',
    selectionProcess: ['Prelims (GS + CSAT)', 'Mains (9 Papers)', 'Personality Test (Interview)'],
    selectionProcessHi: ['प्रारंभिक (जीएस + सीसैट)', 'मुख्य परीक्षा (9 पेपर)', 'व्यक्तित्व परीक्षण'],
  },
  {
    id: 'ssc-chsl-2025',
    title: 'SSC CHSL 2025',
    titleHi: 'एसएससी सीएचएसएल 2025',
    organization: 'Staff Selection Commission',
    organizationHi: 'कर्मचारी चयन आयोग',
    category: 'ssc',
    totalPosts: 3712,
    eligibility: {
      education: '12th Pass (Intermediate) from recognized board',
      educationHi: 'मान्यता प्राप्त बोर्ड से 12वीं पास (इंटरमीडिएट)',
      age: '18-27 years',
      ageHi: '18-27 वर्ष',
    },
    fees: { general: 100, obc: 100, sc_st: 0, female: 0 },
    importantDates: {
      notificationDate: '2025-05-01',
      applyStart: '2025-05-01',
      applyEnd: '2025-05-25',
      examDate: '2025-07-01',
    },
    salary: '₹19,900 - ₹63,200 per month',
    salaryHi: '₹19,900 - ₹63,200 प्रति माह',
    applyLink: 'https://ssc.gov.in',
    notificationLink: 'https://ssc.gov.in/notices',
    status: 'admit_card',
    tags: ['ssc', '12th pass', 'ldc', 'deo', 'postal assistant'],
    description: 'SSC CHSL recruits for Lower Division Clerk (LDC), Data Entry Operator (DEO), Postal Assistant, Sorting Assistant posts in various Central Government departments.',
    descriptionHi: 'एसएससी सीएचएसएल विभिन्न केंद्र सरकार विभागों में लोअर डिवीजन क्लर्क, डेटा एंट्री ऑपरेटर, पोस्टल असिस्टेंट पदों के लिए भर्ती करता है।',
    selectionProcess: ['Tier 1 (CBE)', 'Tier 2 (CBE + Skill Test)', 'Document Verification'],
    selectionProcessHi: ['टियर 1', 'टियर 2 + स्किल टेस्ट', 'दस्तावेज़ सत्यापन'],
  },
];

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
];

export const STATUS_CONFIG = {
  active: { label: 'Apply Now', labelHi: 'अभी आवेदन करें', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  upcoming: { label: 'Upcoming', labelHi: 'आने वाला', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  result: { label: 'Result Out', labelHi: 'परिणाम आया', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  admit_card: { label: 'Admit Card', labelHi: 'एडमिट कार्ड', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
};
