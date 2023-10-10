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
import { IntermediaryModelProfilePicture } from './intermediaryModelProfilePicture';
import { IntermediaryRole } from './intermediaryRole';
import { Telephone } from './telephone';
import { PermissionType } from './permissionType';
import { Person } from './person';


export interface UpdateIntermediaryRequest { 
    advisorUniqueId?: string | null;
    intermediaryRole: IntermediaryRole;
    permissionType: PermissionType;
    person: Person;
    tradingAddressId: string;
    email: string;
    telephone: Telephone;
    profilePicture?: IntermediaryModelProfilePicture | null;
    copyCaseNotificationsToAdminAssistants?: boolean;
    receiveMarketingMaterials?: boolean;
    agreeToTermsAndConditions?: boolean;
    version: number;
}
export namespace UpdateIntermediaryRequest {
}


