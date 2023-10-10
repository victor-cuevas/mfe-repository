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
import { Address } from './address';
import { AddressType2 } from './addressType2';


export interface SecurityPropertyResponseAllOf { 
    addressType?: AddressType2 | null;
    applicantsHaveLegalOwnershipOnOtherProperties?: boolean | null;
    applicantsLiveInTheProperty?: boolean | null;
    arePeopleOver17NotInTheMortgageLivingInTheProperty?: boolean | null;
    constructionDetails?: string | null;
    constructionType?: string | null;
    energyRating?: string | null;
    floor?: number | null;
    hasBeenPreviouslyOwnedByLo?: boolean | null;
    hasCustomerFoundProperty?: boolean | null;
    hasGarageOrParkingSpace?: string | null;
    hasLift?: boolean | null;
    hasPropertyGuaranteeScheme?: boolean | null;
    hasSufferedFromSubsidence?: boolean | null;
    heritageStatus?: string | null;
    isAtRiskOfCoastalOrRiverErosion?: boolean | null;
    isFlatAboveCommercialPremises?: boolean | null;
    isHabitable?: boolean | null;
    isHmo?: boolean | null;
    isPlotSizeGreaterThanOneAcre?: boolean | null;
    isStandardConstruction?: boolean | null;
    isSTandardRoof?: boolean | null;
    isToBeUsedForBusinessPurposes?: boolean | null;
    numberOfBathrooms?: number | null;
    numberOfBedrooms?: number | null;
    numberOfFloors?: number | null;
    numberOfKitchens?: number | null;
    numberOfReceptionrooms?: number | null;
    otherPropertyGuaranteeScheme?: string | null;
    propertyAddress?: Address | null;
    propertyGuaranteeScheme?: string | null;
    propertyInformationId?: number | null;
    propertyLocation?: string | null;
    propertyOwnershipType?: string | null;
    propertyStyle?: string | null;
    propertyType?: string | null;
    propertyValuationAmount?: number | null;
    purchasePrice?: number | null;
    realEstateScenario?: string | null;
    remainingTermOfLeaseInYears?: number | null;
    roofType?: string | null;
    tenure?: string | null;
    yearBuilt?: number | null;
}
