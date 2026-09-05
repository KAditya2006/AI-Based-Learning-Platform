export const ORGANIZATIONS = [
  { id: 'ORG_1', name: 'Ministry of Statistics & Programme Implementation (MoSPI)' }
];

export const DEPARTMENTS_BY_ORG: Record<string, { id: string; name: string }[]> = {
  'ORG_1': [
    { id: 'DEP_1', name: 'National Statistical Office (NSO)' },
    { id: 'DEP_2', name: 'National Statistical Training Academy (NSSTA)' }
  ]
};

export const DESIGNATIONS_BY_DEPT: Record<string, { id: string; name: string }[]> = {
  'DEP_1': [
    { id: 'DES_1_1', name: 'Junior Statistical Officer' },
    { id: 'DES_1_2', name: 'Senior Statistical Officer' },
    { id: 'DES_1_3', name: 'Statistical Officer' },
    { id: 'DES_1_4', name: 'Statistical Analyst' },
    { id: 'DES_1_5', name: 'Data Analyst' },
    { id: 'DES_1_6', name: 'Survey Officer' },
    { id: 'DES_1_7', name: 'Research Officer' },
    { id: 'DES_1_8', name: 'Data Management Officer' },
    { id: 'DES_1_9', name: 'IT / Technical Officer' }
  ],
  'DEP_2': [
    { id: 'DES_2_1', name: 'Project Officer' },
    { id: 'DES_2_2', name: 'Deputy Director' },
    { id: 'DES_2_3', name: 'Director' }
  ]
};

export const FUNCTIONAL_ROLES_BY_DESIG: Record<string, { id: string; name: string }[]> = {
  'DES_1_1': [{ id: 'FR_1_1_1', name: 'Survey Design / Sampling' }],
  'DES_1_2': [{ id: 'FR_1_2_1', name: 'Sampling / Labour Statistics / Price Statistics' }],
  'DES_1_3': [{ id: 'FR_1_3_1', name: 'National Accounts / Price Statistics / Agricultural & Industrial Statistics' }],
  'DES_1_4': [{ id: 'FR_1_4_1', name: 'Data Analytics / Data Visualization' }],
  'DES_1_5': [{ id: 'FR_1_5_1', name: 'Python / SQL / Data Visualization / AI-ML' }],
  'DES_1_6': [{ id: 'FR_1_6_1', name: 'Survey Design / Sampling' }],
  'DES_1_7': [{ id: 'FR_1_7_1', name: 'SDG Indicators / Metadata / Data Quality' }],
  'DES_1_8': [{ id: 'FR_1_8_1', name: 'SQL / Data Quality / Data Privacy / Open Data' }],
  'DES_1_9': [{ id: 'FR_1_9_1', name: 'APIs / Cloud / Cybersecurity / Digital Governance' }],
  'DES_2_1': [{ id: 'FR_2_1_1', name: 'Project Management / Change Management / Communication' }, { id: 'FR_2_1_2', name: 'Project Management' }],
  'DES_2_2': [{ id: 'FR_2_2_1', name: 'Leadership / Decision Making / Change Management' }],
  'DES_2_3': [{ id: 'FR_2_3_1', name: 'Leadership / Decision Making / Communication / Ethics' }]
};

export const DEFAULT_DESIGNATIONS = [];
export const DEFAULT_FUNCTIONAL_ROLES = [];
