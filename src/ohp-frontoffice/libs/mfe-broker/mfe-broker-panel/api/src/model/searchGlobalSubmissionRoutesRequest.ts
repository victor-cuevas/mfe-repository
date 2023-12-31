/**
 * Broker Panel API
 * A Microservice API to support request from the front-end broker panel.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SubmissionRouteType } from './submissionRouteType';
import { SearchFirmDetailsRequestFirmNameSortOrder } from './searchFirmDetailsRequestFirmNameSortOrder';


export interface SearchGlobalSubmissionRoutesRequest { 
    submissionRouteType?: Array<SubmissionRouteType> | null;
    partialFirmName?: string | null;
    firmFcaReference?: number | null;
    partialReference?: string | null;
    isActivated?: boolean | null;
    isInReview?: boolean | null;
    firmNameSortOrder?: SearchFirmDetailsRequestFirmNameSortOrder | null;
}

