import { ApplicantPersonalDetails, EmploymentStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

// Users' information
export type User = {
  fullName: string;
  id: string;
};

export const user1: User = {
  fullName: 'Victor Cuevas',
  id: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
};

// Aplicants' information
export type Applicant = Required<ApplicantPersonalDetails> & {
  applicantId: number;
  fullName: string;
  email: string;
  phone: string;
  employmentStatus: EmploymentStatus;
};

export const applicant1: Applicant = {
  applicantId: 1,
  firstName: 'Test',
  familyName: 'McTesterson',
  fullName: 'Test McTesterson',
  email: 'test@test.com',
  phone: '01234567890',
  birthDate: '1990-02-24T00:00:00+00:00',
  employmentStatus: EmploymentStatus.Employed,
  contactType: '',
  customData: {},
  details: '',
  dualNationalityApplicable: false,
  expectedRetirementAge: 65,
  familyNamePrefix: '',
  secondName: '',
  financialDependantAdults: 0,
  financialDependantChildrenAges: [],
  gender: 'UNKNOWN',
  hasFinancialCommitements: false,
  hasPermanentRightToResideInTheUK: false,
  hasPreviousEmployer: false,
  isApplicantAnExistingLender: false,
  isApplicantPermanentResident: true,
  isApplicantRetired: false,
  maritalStateType: 'SINGLE',
  natureOfVulnerability: '',
  nationality: 'GB',
  previousNameApplicable: false,
  previousNameDetails: {},
  secondNationality: '',
  title: 'MR',
  vulnerableCustomerApplicable: false,
};
