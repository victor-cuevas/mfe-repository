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
import { PrepaymentPenaltyTier } from './prepaymentPenaltyTier';
import { Fee3 } from './fee3';


export interface ProductDetails { 
    features?: Array<string> | null;
    feeReferences?: Array<string> | null;
    fees?: Array<Fee3> | null;
    penaltyFreePeriodAfterRevisionDateInMonths?: number | null;
    penaltyFreePeriodBeforeRevisionDateInMonths?: number | null;
    prepaymentPenaltyExemptionPercentage?: number | null;
    prepaymentPenaltyMethod?: string | null;
    prepaymentPenaltyTiers?: Array<PrepaymentPenaltyTier> | null;
}

