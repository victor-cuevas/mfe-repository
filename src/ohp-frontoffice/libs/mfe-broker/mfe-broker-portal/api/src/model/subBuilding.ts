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
import { SubBuildingFloor } from './subBuildingFloor';
import { SubBuildingEntrance } from './subBuildingEntrance';
import { SubBuildingDoor } from './subBuildingDoor';


export interface SubBuilding { 
    name?: string | null;
    entrance?: SubBuildingEntrance | null;
    floor?: SubBuildingFloor | null;
    door?: SubBuildingDoor | null;
}

