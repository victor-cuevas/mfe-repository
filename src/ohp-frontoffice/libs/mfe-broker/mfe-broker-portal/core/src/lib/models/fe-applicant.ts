export interface FeApplicant {
  applicantType: string;
  firstName: string;
  familyName: string;
  dateOfBirth?: Date;
  mortgageAccountNumber?: string | null;
}
