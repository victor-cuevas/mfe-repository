import { AddressMock } from './address-mock';

export interface ApplicantMock {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  surname: string;
  hasDifferentName: boolean;
  titlePrevName: string;
  namePrev: string;
  middlesNamePrev: string;
  surnamPrev: string;
  dateOfBirth: Date;
  adultsDependants: number;
  childrenDependants: number;
  gender: string;
  isRetired: boolean;
  retirementAge: number;
  isExistingLenderCustomer: boolean;
  isUKResident: boolean;
  nationality: string;
  maritalStatus: string;
  addressesHistory: Array<AddressMock>;
  permanentRighToResideInUk: boolean;
  isVulnerableCustomer: boolean;
  vulnerability: string;
}
