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
import { ApplicantAddressHistoryResponseApplicantInfo } from './applicantAddressHistoryResponseApplicantInfo';
import { FutureChangeInIncome } from './futureChangeInIncome';


export interface ApplicantFutureChangesInIncomeResponse { 
    applicantInfo?: ApplicantAddressHistoryResponseApplicantInfo | null;
    hasFutureChangesIncome?: boolean | null;
    futureChangesInIncome?: Array<FutureChangeInIncome> | null;
}

