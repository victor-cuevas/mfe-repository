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
import { FirmSearchResultEntry } from './firmSearchResultEntry';


export interface FirmSearchResultPageModel { 
    items: Array<FirmSearchResultEntry>;
    page: number;
    size: number;
    total: number;
    totalPages?: number;
}

