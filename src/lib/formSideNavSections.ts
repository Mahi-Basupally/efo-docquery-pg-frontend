export interface FormSummarySection {
  id: string;
  title: string;
}

export const FORM_SUMMARY_SECTIONS: Record<string, FormSummarySection[]> = {
  F1: [
    { id: 'committeeInformation', title: 'Committee Information' },
    { id: 'committeeType', title: 'Committee Type' },
    { id: 'jointFundraisers', title: 'Joint Fundraising Representatives' },
    { id: 'affiliatedCommittees', title: 'Connected Organizations or Committee' },
    { id: 'custodianOfRecords', title: 'Custodian of Records' },
    { id: 'treasurer', title: 'Treasurer and any designated agents' },
    { id: 'banksDepositories', title: 'Banks/Depositories' },
    { id: 'signature', title: 'Signature' },
  ],
  F1M: [
    { id: 'committeeInformation', title: 'Committee Information' },    
    { id: 'candidates', title: 'Status by Qualification' },    
    { id: 'signature', title: 'Signature' },
  ],
   F2: [
    { id: 'candidate_information', title: 'Candidate Information' },
    { id: 'vice_president', title: 'Vice Presidential Candidate' },
    { id: 'principal_committee', title: 'Designation Of Principal Campaign Committee' },
    { id: 'authorized_committee', title: 'Designation Of Other Authorized Committees' },
    { id: 'personal_funds_declaration', title: 'Declaration of Intent to Expend Personal Funds' },
    { id: 'signature', title: 'Signature' },
  ],
   F24: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ],
  F3X: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
    { id: 'contributionExpenditures', title: 'III. Net Contributions/Operating Expenditures' },
  ],
  F3: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },    
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
    { id: 'cashSummary', title: 'III. Cash Summary' },
  ],
  F3S: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
    { id: 'netContributions', title: 'III. Net Contributions (Other Than Loans)' },
    { id: 'netOperatingExpenditures', title: 'IV. Net Operating Expenditures' },
    { id: 'cashSummary', title: 'V. Cash Summary' },
  ],
  F3P: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },
    { id: 'netElectionCycleContributions', title: 'Net Election Cycle-to-Date Contributions and Expenditures' },
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
    { id: 'contributionExpenditures', title: 'III. Contributed Items' },
    { id: 'allocation', title: 'Allocation of Primary Expenditures by State' },
  ],
  F3PS: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },
    { id: 'netElectionCycleContributions', title: 'Net Election Cycle-to-Date Contributions and Expenditures' },
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
    { id: 'contributionExpenditures', title: 'III. Contributed Items' },
    { id: 'allocation', title: 'Allocation of Primary Expenditures by State' },
  ],
  F3L: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ],
  F4: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
    { id: 'summary', title: 'Summary' },    
    { id: 'receipts', title: 'I. Receipts' },
    { id: 'disbursements', title: 'II. Disbursements' },
  ],  
   F5: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ], 
  F6: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ],  
  F7: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ],      
  F8: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ], 
  F9: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ], 
  F99: [
    { id: 'formDetails', title: 'Form Details' },
    { id: 'signature', title: 'Signature' },
  ],
};

export function getFormSummarySections(formType?: string | null): FormSummarySection[] {
  if (!formType) return [];
  return FORM_SUMMARY_SECTIONS[formType.toUpperCase()] || [];
}
