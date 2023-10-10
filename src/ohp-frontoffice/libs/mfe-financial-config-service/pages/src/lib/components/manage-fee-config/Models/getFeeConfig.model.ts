import { feeConfig } from "./feeConfig.model";
import { manageFeeConfigInitialData } from "./manageFeeConfigInitialData.model";

export class getManageFeeConfigScreenDataResponse {
    manageFeeConfigInitialData!: manageFeeConfigInitialData;
    feeConfigList: feeConfig[]=[];
}
