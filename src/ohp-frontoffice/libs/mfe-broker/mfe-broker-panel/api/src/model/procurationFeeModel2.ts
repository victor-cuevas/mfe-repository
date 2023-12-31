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
import { ApplicationType } from './applicationType';
import { Fee } from './fee';
import { SubmissionRouteType } from './submissionRouteType';
import { ProcurationFeeModel2TrailFee } from './procurationFeeModel2TrailFee';


export interface ProcurationFeeModel2 { 
    applicationType: ApplicationType;
    submissionRouteType: SubmissionRouteType;
    completionFee: Fee;
    trailFee?: ProcurationFeeModel2TrailFee | null;
}
export namespace ProcurationFeeModel2 {
}


