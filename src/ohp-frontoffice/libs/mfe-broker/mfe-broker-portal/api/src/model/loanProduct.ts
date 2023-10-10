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


export interface LoanProduct { 
    baseInterestRate?: number | null;
    code?: string | null;
    durationInMonths?: number | null;
    interestRate?: number | null;
    name?: string | null;
    productCommercialCode?: string | null;
    productCommercialName?: string | null;
    productFee?: number | null;
    providerCode?: string | null;
    variabilityType?: string | null;
}

