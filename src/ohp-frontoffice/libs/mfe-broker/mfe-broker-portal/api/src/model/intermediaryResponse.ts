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
import { IntermediaryResponseTradingAddress } from './intermediaryResponseTradingAddress';


export interface IntermediaryResponse { 
    advisorUniqueId?: string | null;
    email?: string | null;
    fullName?: string | null;
    intermediaryId?: string | null;
    telephone?: string | null;
    tradingAddress?: IntermediaryResponseTradingAddress | null;
}

