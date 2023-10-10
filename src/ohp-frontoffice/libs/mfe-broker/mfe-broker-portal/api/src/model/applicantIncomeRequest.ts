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
import { OtherIncome } from './otherIncome';
import { IncomeDetail } from './incomeDetail';


export interface ApplicantIncomeRequest { 
    applicantId?: number | null;
    incomeDetails?: Array<IncomeDetail> | null;
    otherIncomes?: Array<OtherIncome> | null;
}
