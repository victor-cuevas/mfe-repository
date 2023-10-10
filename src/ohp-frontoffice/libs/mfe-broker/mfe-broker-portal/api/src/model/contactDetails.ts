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
import { AddressHistoryItemAddress } from './addressHistoryItemAddress';


export interface ContactDetails { 
    address?: AddressHistoryItemAddress | null;
    email?: string | null;
    firstName?: string | null;
    homePhone?: string | null;
    isCorrespondenceAddressDifferentFromCurrentAddress?: boolean | null;
    lastName?: string | null;
    mobilePhone?: string | null;
    preferredContactMethod?: string | null;
    preferredContactTimeslot?: string | null;
    printedCorrespondenceFormat?: string | null;
    title?: string | null;
    useRelayUK?: boolean | null;
    willHomePhoneChange?: boolean | null;
    workPhone?: string | null;
}

