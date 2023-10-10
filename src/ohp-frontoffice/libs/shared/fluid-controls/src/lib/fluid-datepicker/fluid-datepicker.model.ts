import { FluidControlConfigBase } from '../services/fluid-control-base.interface';

export class FluidControlDatePickerConfig extends FluidControlConfigBase {
  indexArray!: Array<number> ;
  minValueValidation!: string ;
  maxValueValidation!: string ;
  calendarLanguage: any;
}
