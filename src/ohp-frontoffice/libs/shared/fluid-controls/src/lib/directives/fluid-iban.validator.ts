import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { KeyValuePairDto } from '../models/models';

export function ibanValidator(
  inputData: string,
  lengtharray: Array<KeyValuePairDto>
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null  => {
    const countryCode: string = inputData.substr(0, 2);
    const iban = lengtharray.filter((x) => x.label === countryCode)[0];
    if (inputData.length < 4 || !iban) {
      return { InvalidIBAN: true };
    } else {
      if (iban && inputData.length !== +iban.value) {
        return { InvalidIBAN: true };
      }
    }
    return null
  };
}

@Directive({
  selector: '[cfcFluidIban]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FluidIBANValidatorDirective,
      multi: true,
    },
  ],
})
export class FluidIBANValidatorDirective {
  @Input() cfcFluidIban: any;

  private lengthsByCountry: Array<KeyValuePairDto> = [];

  validate(control: AbstractControl): any | null {
    if (control.value) {
      this.assignIban();
      if (this.cfcFluidIban.Required) {
        let IBanNo: string = control.value.toString().toUpperCase();
        IBanNo = IBanNo.replace(/\s/g, '');
        let result: any;
        result = IBanNo
          ? ibanValidator(IBanNo, this.lengthsByCountry)(control)
          : null;
        if (!result) {
          result = this.validateBelgianAccountCheckDigit(IBanNo);
          if (!result) {
            result = this.validateCheckDigit(IBanNo);
          }
        }
        return result;
      } else {
        return null;
      }
    }
    
  }

  validateBelgianAccountCheckDigit(IBAN: string): any | ValidatorFn {
    if (!this.belgianIban(IBAN)) {
      return;
    }
    const accountNrWithoutCheckDigit: string = IBAN.substr(4, 10);
    let checkDigit !: number ;
    if(IBAN){
      checkDigit = parseInt(IBAN.substr(14, 2));
    }
   
    if (checkDigit == null) {
      return { InvalidIBAN: true };
    }
    if (
      this.getCheckDigitOnAVeryLongString(accountNrWithoutCheckDigit) !==
      checkDigit
    ) {
      return { InvalidIBAN: true };
    }
  }

  validateCheckDigit(IBAN: string): any | ValidatorFn {
    if (!IBAN) {
      return;
    }
    const preparedIBAN: string = this.prepareIBANForCheckingTheDigit(IBAN);
    if (this.getCheckDigitOnAVeryLongString(preparedIBAN) !== 1) {
      return { InvalidIBAN: true };
    }
  }

  getCheckDigitOnAVeryLongString(value: string): number {
    let totalDxA = 0;
    let a = 650; // 650 % 97 = 1 (to start with a one)
    for (let i = value.length - 1; i >= 0; i--) {
      a = (a * 10) % 97;
      const d = this.getDigit(value, i);
      totalDxA += a * d;
    }

    const mod = totalDxA % 97;
    return mod === 0 ? 97 : mod;
  }

  getDigit(value: string, possition: number): any | ValidatorFn {
    const dc: string = value[possition];
    let d !: number;
    if(dc){
    
    d = parseInt(dc);
    
    }
    if (isNaN(d)) {
        return { InvalidIBAN: true };
      }
    return d;
  }

  prepareIBANForCheckingTheDigit(IBAN: string): string {
    let isostr = IBAN.toUpperCase();
    isostr = isostr.substr(4) + isostr.substr(0, 4);
    for (let i = 0; i <= 25; i++) {
      // string AtoZ = Convert.ToChar(i + 65).ToString();
      const AtoZ: string = String.fromCharCode(i + 65);
      if (isostr.indexOf(AtoZ) > -1) {
        const AtoZRegex = new RegExp(AtoZ, 'gi');
        isostr = isostr.replace(AtoZRegex, (i + 10).toString());
      }
    }
    return isostr;
  }

  belgianIban(IBAN: string): boolean {
    return IBAN != null && IBAN.startsWith('BE');
  }

  assignIban() {
    this.lengthsByCountry.push(new KeyValuePairDto('AD', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('BE', 16));
    this.lengthsByCountry.push(new KeyValuePairDto('BG', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('CH', 21));
    this.lengthsByCountry.push(new KeyValuePairDto('CY', 28));
    this.lengthsByCountry.push(new KeyValuePairDto('CZ', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('DE', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('BE', 16));
    this.lengthsByCountry.push(new KeyValuePairDto('DK', 18));
    this.lengthsByCountry.push(new KeyValuePairDto('EE', 20));
    this.lengthsByCountry.push(new KeyValuePairDto('ES', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('FI', 18));
    this.lengthsByCountry.push(new KeyValuePairDto('FR', 27));
    this.lengthsByCountry.push(new KeyValuePairDto('GB', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('GE', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('GI', 23));
    this.lengthsByCountry.push(new KeyValuePairDto('GL', 18));
    this.lengthsByCountry.push(new KeyValuePairDto('GR', 27));
    this.lengthsByCountry.push(new KeyValuePairDto('HR', 21));
    this.lengthsByCountry.push(new KeyValuePairDto('HU', 28));
    this.lengthsByCountry.push(new KeyValuePairDto('IE', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('IL', 23));
    this.lengthsByCountry.push(new KeyValuePairDto('IS', 26));
    this.lengthsByCountry.push(new KeyValuePairDto('IT', 27));
    this.lengthsByCountry.push(new KeyValuePairDto('LB', 28));
    this.lengthsByCountry.push(new KeyValuePairDto('LI', 21));
    this.lengthsByCountry.push(new KeyValuePairDto('LT', 20));
    this.lengthsByCountry.push(new KeyValuePairDto('LU', 20));
    this.lengthsByCountry.push(new KeyValuePairDto('LV', 21));
    this.lengthsByCountry.push(new KeyValuePairDto('MC', 27));
    this.lengthsByCountry.push(new KeyValuePairDto('ME', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('MK', 19));
    this.lengthsByCountry.push(new KeyValuePairDto('MT', 31));
    this.lengthsByCountry.push(new KeyValuePairDto('MU', 30));
    this.lengthsByCountry.push(new KeyValuePairDto('NL', 18));
    this.lengthsByCountry.push(new KeyValuePairDto('NO', 15));
    this.lengthsByCountry.push(new KeyValuePairDto('PL', 28));
    this.lengthsByCountry.push(new KeyValuePairDto('PT', 25));
    this.lengthsByCountry.push(new KeyValuePairDto('RO', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('RS', 22));
    this.lengthsByCountry.push(new KeyValuePairDto('SA', 241));
    this.lengthsByCountry.push(new KeyValuePairDto('SE', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('SI', 19));
    this.lengthsByCountry.push(new KeyValuePairDto('SK', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('SM', 27));
    this.lengthsByCountry.push(new KeyValuePairDto('TN', 24));
    this.lengthsByCountry.push(new KeyValuePairDto('TR', 26));
    this.lengthsByCountry.push(new KeyValuePairDto('AL', 28));
    this.lengthsByCountry.push(new KeyValuePairDto('AT', 20));
    this.lengthsByCountry.push(new KeyValuePairDto('BA', 20));
  }
}
