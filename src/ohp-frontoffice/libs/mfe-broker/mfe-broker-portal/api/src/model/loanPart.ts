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
import { LoanPartProduct } from './loanPartProduct';
import { ProductFeeResponse } from './productFeeResponse';


export interface LoanPart { 
    loanPartAmount?: number | null;
    loanPartId?: number | null;
    loanPartType?: string | null;
    mortgageTerm?: number | null;
    product?: LoanPartProduct | null;
    productFees?: Array<ProductFeeResponse> | null;
    repaymentType?: string | null;
}
