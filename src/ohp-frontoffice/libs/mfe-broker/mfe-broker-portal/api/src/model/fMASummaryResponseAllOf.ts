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
import { FeesToBePaid } from './feesToBePaid';
import { ApplicantFMASummary } from './applicantFMASummary';
import { LoanSummary } from './loanSummary';


export interface FMASummaryResponseAllOf { 
    applicants?: Array<ApplicantFMASummary> | null;
    loan?: LoanSummary | null;
    feesToBePaid?: FeesToBePaid | null;
    loanId?: number | null;
    securityProperty?: string | null;
    stage?: string | null;
    status?: string | null;
}
