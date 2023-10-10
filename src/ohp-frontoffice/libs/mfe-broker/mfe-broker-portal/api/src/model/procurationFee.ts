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
import { ApplicationType } from './applicationType';
import { ProcurationFeeTrailFee } from './procurationFeeTrailFee';
import { SubmissionRouteType } from './submissionRouteType';
import { Fee2 } from './fee2';


export interface ProcurationFee { 
    applicationType: ApplicationType;
    submissionRouteType: SubmissionRouteType;
    completionFee: Fee2;
    trailFee?: ProcurationFeeTrailFee | null;
    isDefault?: boolean;
}
export namespace ProcurationFee {
}


