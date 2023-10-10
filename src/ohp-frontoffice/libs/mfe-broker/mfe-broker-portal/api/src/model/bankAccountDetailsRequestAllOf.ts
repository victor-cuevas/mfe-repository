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


export interface BankAccountDetailsRequestAllOf { 
    applicantIds?: Array<number> | null;
    accountNumber?: string | null;
    bankName?: string | null;
    branchAddress?: string | null;
    preferredDayOfTheMonthForDirectDebits?: number | null;
    sortCode?: string | null;
}

