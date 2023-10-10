import { baseModel } from "./baseModel.model";
import { mutationTypeList } from "./mutationTypeList.model";

export class mutationTypeConfig extends baseModel{
  mutationType!: mutationTypeList;
  chargeMutationCosts!: boolean;
  chargeCostForVariableConversion!: boolean;
  no4EyeValidationApplicable!: boolean;
  isMortgageForTaxCertificate!: boolean;
  isApplicable!: boolean
  gridDisable!:boolean
  gridVisibilityCheck!: boolean
  isDirtyForIsApplicable!: boolean
}

