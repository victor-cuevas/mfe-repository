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
import { ApplicantFutureChangesInIncomeResponse } from './applicantFutureChangesInIncomeResponse';


export interface FutureChangesInIncomeResponse { 
    applicationDraftId?: number;
    versionNumber?: number;
    applicantFutureChangesInIncome?: Array<ApplicantFutureChangesInIncomeResponse> | null;
}

