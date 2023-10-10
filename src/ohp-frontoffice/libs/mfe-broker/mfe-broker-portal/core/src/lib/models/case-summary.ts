export interface CaseSummary {
  id: number;
  caseIdentifier: string;
  caseReference: string;
  stage: string;
  remortgage: boolean;
  applicant: Array<{ name: string }>;
  status: string;
  applicationType: string;
  propertyPurpose: string;
  assignedTo: Array<{
    name: string;
    img: string;
  }>;
  progress: number;
}
