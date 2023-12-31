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


/**
 * 
 */
export type EmploymentStatus = 'EMPLOYED' | 'SELF_EMPLOYED_PARTNERSHIP' | 'SELF_EMPLOYED' | 'DIRECTOR_25_PLUS' | 'DIRECTOR_LESS_25' | 'HOME_MAKER' | 'STUDENT' | 'NOT_EMPLOYED' | 'RETIRED';

export const EmploymentStatus = {
    Employed: 'EMPLOYED' as EmploymentStatus,
    SelfEmployedPartnership: 'SELF_EMPLOYED_PARTNERSHIP' as EmploymentStatus,
    SelfEmployed: 'SELF_EMPLOYED' as EmploymentStatus,
    Director25Plus: 'DIRECTOR_25_PLUS' as EmploymentStatus,
    DirectorLess25: 'DIRECTOR_LESS_25' as EmploymentStatus,
    HomeMaker: 'HOME_MAKER' as EmploymentStatus,
    Student: 'STUDENT' as EmploymentStatus,
    NotEmployed: 'NOT_EMPLOYED' as EmploymentStatus,
    Retired: 'RETIRED' as EmploymentStatus
};

