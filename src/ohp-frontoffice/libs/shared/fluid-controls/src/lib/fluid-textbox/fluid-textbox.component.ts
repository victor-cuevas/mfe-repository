import {
    Component,
    forwardRef,
    Output,
    EventEmitter,
    Input,
    HostListener,
  } from '@angular/core';
  import { FluidControlBaseComponent } from '../services/fluid-control-base.component';
  import {
    NG_VALUE_ACCESSOR,
    ControlContainer,
    NgForm,
  } from '@angular/forms';
  import {
    EmailPattern,
    EmailPatternUM,
    MobilePattern,
    MobilePhonePattern,
    PasswordPattern,
    PostalCodePattern,
    HasUppercase,
    Haslowercase,
    HasNumber,
    HasSpecialCharacter,
    AlphabetPattern,
  } from '../models/constants';
import { FluidMaskConfigService } from '../services/fluid-mask-config.service';
import { FluidControlType } from '../models/enum';

  
  @Component({
    selector: 'cfc-fluid-textbox',
    templateUrl: './fluid-textbox.component.html',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FluidTextBoxComponent),
        multi: true,
      },
    ],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  })
  export class FluidTextBoxComponent extends FluidControlBaseComponent {
    ControlType = FluidControlType;
    EmailPattern = EmailPattern;
    EmailPatternUM = EmailPatternUM;
    PhoneNumberPattern = MobilePattern;
    MobileNumberPattern = MobilePhonePattern;
    TextAlphabetPattern = AlphabetPattern;
    PasswordPattern = PasswordPattern;
    postalCodePattern = PostalCodePattern;
    isIbanInvalid = false;
    isAmountChange = false;
    HasUppercase = HasUppercase;
    Haslowercase = Haslowercase;
    HasNumber = HasNumber;
    HasSpecialCharacter = HasSpecialCharacter;
    @Input() localeValue!: string;
    @Input() percentageFormat!: string;
    @Input() minimumValue!: number;
    @Input() maximumValue!: number;
    @Input() isAllowSpace!: boolean;
    @Input() isAllowDot!: boolean;
    @Input() autocompleteStatus!: string;
    @Input() isDefaultValidation = true;
    @Input() defaultValidationForAmount!: boolean;
    @Input() validateIBAN!: boolean
    isFocus = false;
  
    @Output() OnchangedPassword: EventEmitter<any> = new EventEmitter();
    @Output() OnchangedAmount: EventEmitter<any> = new EventEmitter();
    @Output() OnchangedPostalCode: EventEmitter<any> = new EventEmitter();
    @Output() ibanNumberEmit: EventEmitter<any> = new EventEmitter();
    @Output() OnchangedText: EventEmitter<any> = new EventEmitter();
    @Output() OnchangedNumber: EventEmitter<any> = new EventEmitter();
    @Output() modelChanged: EventEmitter<any> = new EventEmitter();

  
    minValueErrorStatus = false;
    maxValueErrorStatus = false;
  
    constructor(public maskConfigService: FluidMaskConfigService) {
      super();
    }
  
    CurrencyMaskConfig = this.maskConfigService.NullableCurrencyMaskConfig;
    NonDecimalCurrencyMaskConfig =
      this.maskConfigService.NullableNonDecimalCurrencyMaskConfig;
    ToggleVisibility(password: { type: string; }) {
      password.type === 'password'
        ? (password.type = 'text')
        : (password.type = 'password');
    }
  
    validatePostCode(zipCode: any) {
      this.OnchangedPostalCode.emit(zipCode);
    }
  
    OnchangePassword(value: any) {
      this.OnchangedPassword.emit(value);
    }

    modelChange(event: any) {
      this.modelChanged.emit(event);
    }

    OnchangeText(value: any) {
      value = (value === 'NaN' || value === undefined || value === "") ? null : value;
      this.OnchangedText.emit(value);
    }
  
    OnchangeNumber(value: any) {
      value = (value === 'NaN' || value === undefined || value === "") ? null : value;
      this.OnchangedNumber.emit(value);
    }
    OnchangeAmount(value: string | null) {
      value = (value === 'NaN' || value === undefined || value === "") ? null : value;
      this.OnchangedAmount.emit(value);
    }
  
    onPasteAmount(value: string) {
      this.OnchangedAmount.emit(parseFloat(value));
    }
  
    onIbanBlur(value: any) {
      this.ibanNumberEmit.emit(value);
    }
  
    validate(e:any) {
      const keyCode = e.keyCode || e.which;
      let regex = /^[A-Za-z]+$/;
      if (
        this.isAllowSpace &&
        e?.target?.value?.trim()?.length &&
        e?.target?.selectionStart
      ) {
        regex = /^[a-zA-Z\s]+$/;
      }
      if (
        this.isAllowDot &&
        e?.target?.value?.trim()?.length &&
        e?.target?.selectionStart
      ) {
        regex = /^[a-zA-Z]+$/;
      }
  
      const isValid = regex.test(String.fromCharCode(keyCode));
      if (isValid) {
        return true;
      } else {
        return e.preventDefault();
      }
    }
  
    setFocusStatus(value: boolean) {
      this.isFocus = value;
    }
  
    @HostListener('focusout', ['$event'])
    onBlurTrim(event: any) {
      if (event?.target?.value) {
        event.target.value = event.target.value.trim();
        this.ngModelChange.emit(event.target.value);
      }
    }
  }
