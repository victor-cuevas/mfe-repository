/**
 * Broker Portal API
 * A Microservice API to support request from the front-end broker portals.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ApplicantPersonalDetailsPreviousNameDetails } from './applicantPersonalDetailsPreviousNameDetails';


export interface ApplicantPersonalDetails { 
    applicantId?: number | null;
    birthDate?: string | null;
    contactType?: string | null;
    customData?: { [key: string]: string; } | null;
    details?: string | null;
    dualNationalityApplicable?: boolean | null;
    expectedRetirementAge?: number | null;
    familyName?: string | null;
    familyNamePrefix?: string | null;
    financialDependantAdults?: number | null;
    financialDependantChildrenAges?: Array<number> | null;
    firstName?: string | null;
    gender?: string | null;
    hasFinancialCommitements?: boolean | null;
    hasPermanentRightToResideInTheUK?: boolean | null;
    hasPreviousEmployer?: boolean | null;
    isApplicantAnExistingLender?: boolean | null;
    isApplicantPermanentResident?: boolean | null;
    isApplicantRetired?: boolean | null;
    maritalStateType?: string | null;
    nationality?: string | null;
    natureOfVulnerability?: string | null;
    previousNameApplicable?: boolean | null;
    previousNameDetails?: ApplicantPersonalDetailsPreviousNameDetails | null;
    secondName?: string | null;
    secondNationality?: string | null;
    title?: string | null;
    vulnerableCustomerApplicable?: boolean | null;
}
