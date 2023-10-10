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
import { ExpenditureDetailsOtherExpenditureDetail } from './expenditureDetailsOtherExpenditureDetail';


export interface ExpenditureDetails { 
    childCare?: number | null;
    groundRent?: number | null;
    maintenance?: number | null;
    numberOfAdults?: number | null;
    numberOfChildren?: number | null;
    otherExpenditureDetail?: ExpenditureDetailsOtherExpenditureDetail | null;
    schoolFees?: number | null;
    secondHomeRunningCosts?: number | null;
    serviceCharge?: number | null;
    tenancyRentOnOtherProperty?: number | null;
}

