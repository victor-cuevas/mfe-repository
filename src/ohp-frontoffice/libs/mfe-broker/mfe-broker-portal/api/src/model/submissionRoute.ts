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
import { FirmDetailsModelTelephone } from './firmDetailsModelTelephone';
import { Address2 } from './address2';
import { SubmissionRouteType } from './submissionRouteType';
import { BankAccount } from './bankAccount';
import { ProcurationFee } from './procurationFee';


export interface SubmissionRoute { 
    id: string;
    reference?: string | null;
    submissionRouteType: SubmissionRouteType;
    firmName: string;
    firmFcaReference: number;
    fcaStatus?: string | null;
    fcaPermissionCode?: string | null;
    isActivated?: boolean;
    isInReview?: boolean;
    submissionRouteAddress: Address2;
    procurationFees?: Array<ProcurationFee>;
    bankDetails: BankAccount;
    email?: string | null;
    telephone?: FirmDetailsModelTelephone | null;
}
export namespace SubmissionRoute {
}


