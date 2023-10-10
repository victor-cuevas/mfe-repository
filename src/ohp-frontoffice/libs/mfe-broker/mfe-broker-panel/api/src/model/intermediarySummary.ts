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
import { IntermediarySummaryRole } from './intermediarySummaryRole';
import { IntermediarySummaryPermission } from './intermediarySummaryPermission';


export interface IntermediarySummary { 
    brokerId?: string | null;
    email?: string | null;
    fullName?: string | null;
    permission?: IntermediarySummaryPermission | null;
    role?: IntermediarySummaryRole | null;
}
