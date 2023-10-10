export interface CaseTableObject {
  filter?: {
    caseId?: string;
    contactsInformation?: string;
    created?: Date[];
    modified?: Date[];
    totalLoanAmount?: number[];
    stage?: string[];
    status?: string[];
    createdByFullName?: string;
    assigneeFullName?: string;
  };
  sorting?: {
    field: string;
    order: number;
  };
  pagination?: {
    first: number;
    rows: number;
    totalRecords: number;
  };
}
