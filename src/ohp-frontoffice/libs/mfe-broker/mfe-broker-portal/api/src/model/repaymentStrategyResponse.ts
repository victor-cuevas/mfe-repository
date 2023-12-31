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


export interface RepaymentStrategyResponse { 
    applicationDraftId?: number;
    versionNumber?: number;
    applicants?: Array<number> | null;
    currentValue?: number | null;
    interestOnlyRepaymentId?: number | null;
    interestOnlyRepaymentType?: string | null;
    maturityDate?: string | null;
    monthlyCost?: number | null;
    projectedValue?: number | null;
    referenceNumber?: string | null;
}

