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
import { RoleIntermediaryRole } from './roleIntermediaryRole';
import { PermissionType } from './permissionType';
import { UserRole } from './userRole';


export interface Role { 
    intermediaryRole: RoleIntermediaryRole;
    userRole: UserRole;
    permissionType: PermissionType;
}
export namespace Role {
}


