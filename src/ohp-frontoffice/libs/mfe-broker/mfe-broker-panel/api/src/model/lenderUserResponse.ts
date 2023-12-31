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
import { PanelPermissionType } from './panelPermissionType';
import { IntermediaryRole } from './intermediaryRole';
import { Telephone } from './telephone';
import { IntermediarySummary } from './intermediarySummary';
import { Person } from './person';
import { UserStatus } from './userStatus';
import { UserType } from './userType';


export interface LenderUserResponse { 
    userId: string;
    userType: UserType;
    status: UserStatus;
    person: Person;
    subordinateIntermediaryIds?: Array<string>;
    roleMappings: Array<IntermediarySummary> | null;
    email: string;
    telephone?: Telephone;
    profilePicture?: IntermediaryModelProfilePicture | null;
    firmId?: string | null;
    agreeToTermsAndConditions: boolean;
    receiveMarketingMaterials?: boolean;
    lastUpdated?: string;
    creationDate?: string;
    version: number;
    permissionType?: PanelPermissionType;
    role?: IntermediaryRole;
}
export namespace LenderUserResponse {
}


