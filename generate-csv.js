const fs = require('fs');
const path = require('path');

// We will recreate the maps here to avoid ts-node compilation issues
const ORGANIZATIONS = [
  { id: 'D001', name: 'Ministry of Statistics & Programme Implementation (MoSPI)' },
  { id: 'D002', name: 'National Statistical Office (NSO)' },
  { id: 'D003', name: 'National Statistical Commission (NSC)' },
  { id: 'D004', name: 'National Statistical Training Academy (NSSTA)' },
  { id: 'D005', name: 'State Directorate of Economics & Statistics' },
  { id: 'D006', name: 'Ministry of Agriculture & Farmers Welfare' },
  { id: 'D007', name: 'Ministry of Health & Family Welfare' },
  { id: 'D008', name: 'Ministry of Labour & Employment' },
  { id: 'D009', name: 'Ministry of Finance' },
  { id: 'D010', name: 'Ministry of Education' }
];

const DEPARTMENTS_BY_ORG = {
  'D001': [
    { id: 'DEP_M1', name: 'Central Statistics Office (CSO)' },
    { id: 'DEP_M2', name: 'National Sample Survey Office (NSSO)' },
    { id: 'DEP_M3', name: 'Programme Implementation Wing' }
  ],
  'D002': [
    { id: 'DEP_N1', name: 'Survey Design and Research' },
    { id: 'DEP_N2', name: 'Field Operations Division' },
    { id: 'DEP_N3', name: 'Data Processing Division' }
  ],
  'D003': [
    { id: 'DEP_C1', name: 'Policy and Coordination' },
    { id: 'DEP_C2', name: 'Statistical Audit' }
  ],
  'D004': [
    { id: 'DEP_T1', name: 'Training Operations' },
    { id: 'DEP_T2', name: 'Curriculum Development' }
  ],
  'D005': [
    { id: 'DEP_S1', name: 'State Statistical Coordination' },
    { id: 'DEP_S2', name: 'Economic Census' }
  ],
  'D006': [{ id: 'DEP_A1', name: 'Agricultural Statistics' }],
  'D007': [{ id: 'DEP_H1', name: 'Health Intelligence' }],
  'D008': [{ id: 'DEP_L1', name: 'Labour Bureau' }],
  'D009': [{ id: 'DEP_F1', name: 'Economic Affairs' }],
  'D010': [{ id: 'DEP_E1', name: 'Educational Statistics' }]
};

const DESIGNATIONS_BY_DEPT = {
  'DEP_M1': [
    { id: 'DES_M1_1', name: 'Director General' },
    { id: 'DES_M1_2', name: 'Additional Director General' },
    { id: 'DES_M1_3', name: 'Director' },
    { id: 'DES_M1_4', name: 'Joint Director' },
    { id: 'DES_M1_5', name: 'Deputy Director' },
    { id: 'DES_M1_6', name: 'Assistant Director' },
    { id: 'DES_M1_7', name: 'Senior Statistical Officer' },
    { id: 'DES_M1_8', name: 'Junior Statistical Officer' }
  ],
  'DEP_M2': [
    { id: 'DES_M2_1', name: 'Deputy Director General' },
    { id: 'DES_M2_2', name: 'Director' },
    { id: 'DES_M2_3', name: 'Senior Statistical Officer' },
    { id: 'DES_M2_4', name: 'Junior Statistical Officer' }
  ],
  'DEP_N2': [
    { id: 'DES_N2_1', name: 'Deputy Director General' },
    { id: 'DES_N2_2', name: 'Superintending Officer' },
    { id: 'DES_N2_3', name: 'Field Investigator' }
  ]
};

const FUNCTIONAL_ROLES_BY_DESIG = {
  'DES_M1_7': [
    { id: 'FR_1', name: 'Statistical Analysis' },
    { id: 'FR_2', name: 'Data Analysis' },
    { id: 'FR_3', name: 'Data Quality & Validation' }
  ],
  'DES_M1_8': [
    { id: 'FR_4', name: 'Survey Operations' },
    { id: 'FR_5', name: 'Data Management' }
  ],
  'DES_N2_3': [
    { id: 'FR_6', name: 'Survey Operations' },
    { id: 'FR_7', name: 'Sampling' }
  ]
};

const DEFAULT_DESIGNATIONS = [
  { id: 'DES_DEF_1', name: 'Director' },
  { id: 'DES_DEF_2', name: 'Deputy Director' },
  { id: 'DES_DEF_3', name: 'Senior Statistical Officer' },
  { id: 'DES_DEF_4', name: 'Junior Statistical Officer' },
  { id: 'DES_DEF_5', name: 'Other' }
];

const DEFAULT_FUNCTIONAL_ROLES = [
  { id: 'FR_DEF_1', name: 'Statistical Analysis' },
  { id: 'FR_DEF_2', name: 'Data Analysis' },
  { id: 'FR_DEF_3', name: 'Survey Operations' },
  { id: 'FR_DEF_4', name: 'Sampling' },
  { id: 'FR_DEF_5', name: 'Data Quality & Validation' },
  { id: 'FR_DEF_6', name: 'Research & Analysis' },
  { id: 'FR_DEF_7', name: 'Economic Statistics' },
  { id: 'FR_DEF_8', name: 'Social Statistics' },
  { id: 'FR_DEF_9', name: 'Demographic Statistics' },
  { id: 'FR_DEF_10', name: 'Statistical Computing' },
  { id: 'FR_DEF_11', name: 'Data Management' },
  { id: 'FR_DEF_12', name: 'Data Governance' },
  { id: 'FR_DEF_13', name: 'Policy Analysis' },
  { id: 'FR_DEF_14', name: 'Programme Management' },
  { id: 'FR_DEF_15', name: 'Monitoring & Evaluation' },
  { id: 'FR_DEF_16', name: 'Training & Capacity Building' },
  { id: 'FR_DEF_17', name: 'Administration' },
  { id: 'FR_DEF_18', name: 'Finance & Accounts' },
  { id: 'FR_DEF_19', name: 'IT / Digital Systems' },
  { id: 'FR_DEF_20', name: 'Database Management' },
  { id: 'FR_DEF_21', name: 'AI / Machine Learning' },
  { id: 'FR_DEF_22', name: 'Cyber Security' },
  { id: 'FR_DEF_23', name: 'e-Governance' },
  { id: 'FR_DEF_24', name: 'Learning & Development' }
];

let csv = "Organization,Department,Designation,Functional Role\n";

for (const org of ORGANIZATIONS) {
  const depts = DEPARTMENTS_BY_ORG[org.id] || [];
  if (depts.length === 0) {
    csv += `"${org.name}","","",""\n`;
  }
  for (const dept of depts) {
    const desigs = DESIGNATIONS_BY_DEPT[dept.id] || DEFAULT_DESIGNATIONS;
    for (const desig of desigs) {
      const roles = FUNCTIONAL_ROLES_BY_DESIG[desig.id] || DEFAULT_FUNCTIONAL_ROLES;
      for (const role of roles) {
        csv += `"${org.name}","${dept.name}","${desig.name}","${role.name}"\n`;
      }
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'Organization_Hierarchy.csv'), csv);
console.log('CSV generated successfully.');
