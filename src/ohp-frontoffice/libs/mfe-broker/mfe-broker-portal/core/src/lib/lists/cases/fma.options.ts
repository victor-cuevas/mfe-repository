import { PreferredContactMethod, ValuationContact } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

//contact detail
export const casesFmaPreferredContactMethod = [
  { label: 'Prefer no contact', value: PreferredContactMethod.NO_CONTACT },
  { label: 'Email', value: PreferredContactMethod.EMAIL },
  { label: 'Work phone', value: PreferredContactMethod.WORK_PHONE },
  { label: 'Mobile phone', value: PreferredContactMethod.MOBILE_PHONE },
  { label: 'Home phone', value: PreferredContactMethod.HOME_PHONE },
  { label: 'Postal mail', value: PreferredContactMethod.POSTAL_MAIL },
];

export const casesFmaPreferredContactTimeslot = [
  { label: 'Any time', value: 'anyTime' },
  { label: 'Weekdays 8:00 - 20:00', value: 'weekdays820' },
  { label: 'Weekdays 9:00 - 17:00', value: 'weekdays917' },
  { label: 'Weekend 8:00 - 20:00', value: 'weekends820' },
  { label: 'Evening 18:00 - 20:00', value: 'evening1820' },
];

export const casesFmaPrintedCorrespondenceFormatOptions = [{ label: 'Standard size', value: 'standardSize' }];

//Valuation detail
export const fmaValuationTypeOptions = [
  { label: 'Free valuation', value: 'FreeValuation' },
  { label: 'Basic valuation (£200)', value: 'BasicValuation' },
];

export const fmaValuationContactOptions = [
  { label: 'Estate agent', value: ValuationContact.ESTATE_AGENT },
  { label: 'Seller', value: ValuationContact.SELLER },
];

export const fmaContactMethodOptions = [
  { label: 'Mobile phone', value: PreferredContactMethod.MOBILE_PHONE },
  { label: 'Work phone', value: PreferredContactMethod.WORK_PHONE },
  { label: 'Home phone', value: PreferredContactMethod.HOME_PHONE },
  { label: 'Email', value: PreferredContactMethod.EMAIL },
];
