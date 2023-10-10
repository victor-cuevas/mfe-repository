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
import { SaveProcurationFeeRequest } from './saveProcurationFeeRequest';
import { FirmFcaDetailsModelTelephone } from './firmFcaDetailsModelTelephone';
import { Address } from './address';
import { SubmissionRouteType } from './submissionRouteType';
import { BankAccount } from './bankAccount';


export interface UpdateGlobalSubmissionRouteRequest { 
    reference?: string | null;
    submissionRouteType: SubmissionRouteType;
    firmName: string;
    firmFcaReference: number;
    fcaStatus?: string | null;
    isActivated?: boolean;
    isInReview?: boolean;
    submissionRouteAddress: Address;
    procurationFees?: Array<SaveProcurationFeeRequest>;
    bankDetails: BankAccount;
    email?: string | null;
    telephone?: FirmFcaDetailsModelTelephone | null;
}
export namespace UpdateGlobalSubmissionRouteRequest {
}


