import { FluidControlConfigBase } from '../services/fluid-control-base.interface';

export class FluidControlTextBoxConfig extends FluidControlConfigBase {
  minlength!: number;
  maxlength!: number;
  externalError!: boolean;
  indexArray!: Array<number>;
  minLengthValidation!: string;
  uppercaseValidation!: string;
  lowercaseValidation!: string;
  numberValidation!: string;
  specialCharacterValidation!: string;
  validationHeader!: string;
  minValueValidation!: string;
  maxValueValidation!: string;
  invalidDefaultValidation!: string;
  invalidPostalCodeValidation!: string;
  invalidIBANValidation!: string;
}
