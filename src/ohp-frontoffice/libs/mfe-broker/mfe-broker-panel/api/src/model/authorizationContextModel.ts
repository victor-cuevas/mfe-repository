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
import { IntermediaryRole } from './intermediaryRole';
import { AuthorizationContextModelUserType } from './authorizationContextModelUserType';
import { AuthorizationContextModelPermission } from './authorizationContextModelPermission';
import { IntermediarySummary } from './intermediarySummary';


export interface AuthorizationContextModel { 
    agreeToTermsAndConditions?: boolean | null;
    firmId?: string | null;
    firmName?: string | null;
    firstName?: string | null;
    intermediaryId?: string | null;
    lastName?: string | null;
    permission?: AuthorizationContextModelPermission | null;
    profilePicture?: string | null;
    role?: IntermediaryRole;
    roleMappings?: Array<IntermediarySummary> | null;
    subordinateIntermediaries?: Array<IntermediarySummary> | null;
    title?: string | null;
    userType?: AuthorizationContextModelUserType | null;
}
export namespace AuthorizationContextModel {
}

