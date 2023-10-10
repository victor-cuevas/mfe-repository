import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IOptions } from '../directives/fluid-currency-mask.directive';

@Injectable()
export class FluidMaskConfigService {
  FadeoutEvent: EventEmitter<any> = new EventEmitter();
  FadeoutEventReciever: Observable<any> = this.FadeoutEvent.asObservable();
  CurrencyMaskConfig: IOptions;
  NonNegativeCurrencyMaskConfig = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    IspropertyNullable: false,
    canRoundOff: true,
  };
  NegativeCurrencyMaskConfig = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: true,
    IspropertyNullable: false,
    canRoundOff: true,
  };
  NullableCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: false,
    nullable: true,
    IspropertyNullable: false,
    canRoundOff: false,
  };
  NullableRoundOffCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: false,
    nullable: true,
    IspropertyNullable: false,
    canRoundOff: true,
  };
  NegativeNullableCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: true,
    nullable: true,
    IspropertyNullable: false,
    canRoundOff: true,
  };
  NonNullableCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: false,
    nullable: false,
    IspropertyNullable: false,
    canRoundOff: true,
  };
  NonNullableControlWithNullablePropertyCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: false,
    nullable: false,
    IspropertyNullable: true,
    canRoundOff: true,
  };
  NullableNonDecimalCurrencyMaskConfig: any = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    maxLength: 15,
    allowNegative: false,
    nullable: true,
    IspropertyNullable: false,
    canRoundOff: false,
    precision: 0,
  };
  constructor() {
    this.CurrencyMaskConfig = (<Partial<IOptions>>{
      prefix: '',
      thousands: '.',
      decimal: ',',
      allowNegative: false,
      nullable: false,
      IspropertyNullable: false,
      canRoundOff: true,
    }) as IOptions;
  }
}
