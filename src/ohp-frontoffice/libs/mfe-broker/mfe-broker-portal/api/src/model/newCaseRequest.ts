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
import { NewCaseRequestCasePurposeType } from './newCaseRequestCasePurposeType';
import { Applicant } from './applicant';


export interface NewCaseRequest { 
    propertyPurpose?: string | null;
    casePurposeType?: NewCaseRequestCasePurposeType | null;
    confirmStatements?: boolean | null;
    confirmApplicantsPermission?: boolean | null;
    applicantConsentToUseData?: boolean | null;
    agreeToDocumentsAndTAndC?: boolean | null;
    applicants?: Array<Applicant> | null;
    assigneeId: string;
    ownerId: string;
    createdBy: string;
}

