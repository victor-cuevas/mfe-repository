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
import { FirmFcaDetailsModelTelephone } from './firmFcaDetailsModelTelephone';
import { FirmFcaDetailsModelFirmAddress } from './firmFcaDetailsModelFirmAddress';


export interface UpdateLenderRequest { 
    lenderName: string;
    reference: string;
    email: string;
    contactPerson?: string | null;
    website?: string | null;
    complaintsWebpage: string;
    telephone?: FirmFcaDetailsModelTelephone | null;
    address?: FirmFcaDetailsModelFirmAddress | null;
    version: number;
}
