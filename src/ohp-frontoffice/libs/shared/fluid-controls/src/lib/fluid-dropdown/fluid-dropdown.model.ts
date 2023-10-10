import { FluidControlConfigBase } from '../services/fluid-control-base.interface';

export class FluidDropDownConfig extends FluidControlConfigBase {}

export enum DropDownType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}
