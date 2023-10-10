import {
    Directive,
    HostListener,
    ElementRef,
    Input,
    OnInit,
    Optional,
    OnChanges,
    Output,
    EventEmitter,
  } from '@angular/core';
  import localeFr from '@angular/common/locales/fr';
  import { registerLocaleData, DecimalPipe } from '@angular/common';
  import { NgModel } from '@angular/forms';
  
  // register french locale in the app for decimalPipe conversion
  registerLocaleData(localeFr);
  
  const DEFAULT_VALUE = '0';
  const EMPTY_STRING = '';
  const DOT = '.';
  const MINUS = '-';
  
  export interface IOptions {
    prefix: string;
    decimal: string;
    precision: number;
    thousands: string;
    maxLength: number;
    allowNegative: boolean;
    nullable: boolean;
    IspropertyNullable: boolean;
    canRoundOff: boolean;
  }
  
  @Directive({
    selector: '[cfcFluidCurrencyMask]',
    providers: [NgModel, DecimalPipe],
  })
  export class FluidCurrencyMaskDirective implements OnInit, OnChanges {
    private element : HTMLInputElement ;
    private _options!: IOptions;
    private isNumber!: boolean;
    private isEmitted = false;
    private isFocus = false;
  
    @Input() cfcFluidCurrencyMask: any;
    @Output() ngModelChange = new EventEmitter();
  
    constructor(
      @Optional() public model: NgModel ,
      private elementRef: ElementRef,
      private decimalPipe: DecimalPipe
    ) {
      this.options = (<Partial<IOptions>>{
        prefix: '',
        thousands: '.',
        decimal: ',',
        allowNegative: false,
        nullable: false,
        IspropertyNullable: false,
        canRoundOff: true,
      }) as IOptions;
      this.element = this.elementRef.nativeElement;
    }
  
    ngOnChanges(changes : any) {
      if (changes.cfcFluidCurrencyMask) {
        if (!this.IsEmptyOrWhiteSpace(this.cfcFluidCurrencyMask)) {
            setTimeout(() => {
              this.element.value = this.transform(this.cfcFluidCurrencyMask);
            }, 2);
        }
      }
    }
  
    ngOnInit(): void {
      // autocomplete off
      this.isFocus = false;
      this.element.setAttribute('autocomplete', 'off');
      // set default options if options are not set by user
      this.setDefaultOptions();
      if (this.model) {
        this.model.control.valueChanges.subscribe((value: string | number) => {
          if (!this.isEmitted) {
            if (!this.isNumber) {
              this.isNumber = true; // (this.model.value !== undefined || this.model.value !== null) && typeof (this.model.value) === Number.name.toLowerCase();
            }
            if (value === this.model.model && (value || value === 0)) {
              this.writeValue(this.transform(this.model.model));
            } else if (
              !value &&
              !this.options.nullable &&
              !this.options.IspropertyNullable
            ) {
              this.writeValue('0,00', false, true);
            }
            if (value && value.toString().indexOf(this.options.decimal) > -1) {
              this.updateModel(this.transformBack(value.toString(), true));
            }
            if (
              !value &&
              !this.options.nullable &&
              value !== '0' &&
              value !== 0 &&
              !this.options.IspropertyNullable
            ) {
              this.updateModel(this.transformBack('0,00', true));
            }
          } else {
            this.isEmitted = false;
          }
        });
      }
    }
  
    @Input()
    set options(value: IOptions) {
      if (
        value &&
        value.decimal &&
        value.thousands &&
        value.decimal === value.thousands
      ) {
        throw new Error(
          `The options decimal => '${this.options.decimal}' and  thousands => '${this.options.thousands}' should not be same.`
        );
      }
      this._options = value;
    }
    get options(): IOptions {
      return this._options;
    }
  
    @HostListener('focus', ['$event'])
    onFocus(event: any): void {
      this.isFocus = true;
      if (!event.target.hasAttribute('readOnly')) {
        this.writeValue(this.transformBack(event.target.value), true);
      }
    }
  
    @HostListener('blur', ['$event'])
    onBlur(event: any): void {
      this.isFocus = false;
      if (!event.target.hasAttribute('readOnly')) {
        const elementValue: string = event.target.value;
        const modelValue: string | null = this.transformBack(elementValue, true);
        this.updateModel(
          this.IsEmptyOrWhiteSpace(modelValue) ? undefined : modelValue,
          true
        );
        this.writeValue(this.transform(elementValue));
      }
    }
  
    @HostListener('paste', ['$event'])
    onpaste(event: any): void {
      this.isFocus = false;
      if (!event.target.hasAttribute('readOnly')) {
        const clp = (event.originalEvent || event).clipboardData;
        let clipboardValue: string = this.getExtractedValue(
          clp
            ? clp.getData('text/plain')
            : (window as any).clipboardData.getData('text')
        );
        let valueToPaste: string = EMPTY_STRING;
        const selectedValue: string = this.element.value.slice(
          event.target.selectionStart,
          event.target.selectionEnd
        );
        const isMinus: boolean = clipboardValue.indexOf(MINUS) !== -1;
        clipboardValue = isMinus
          ? clipboardValue.replace(MINUS, EMPTY_STRING)
          : clipboardValue;
        if (
          this.isValueExceedMaxLength(this.element.value) ||
          (event.target.value.indexOf(MINUS) !== -1 &&
            event.target.selectionStart === 0 &&
            event.target.selectionEnd === 0)
        ) {
          clipboardValue = EMPTY_STRING;
        }
        if (
          !this.IsEmptyOrWhiteSpace(clipboardValue) &&
          clipboardValue.charAt(0) !== this.options.decimal
        ) {
          if (selectedValue.length === this.element.value.length) {
            valueToPaste = this.isValueExceedMaxLength(clipboardValue)
              ? clipboardValue.slice(0, this.options.maxLength - 1)
              : clipboardValue;
          } else {
            valueToPaste = this.getValueByMaxLength(
              event,
              selectedValue.indexOf(this.options.decimal) === -1 &&
                this.element.value.indexOf(this.options.decimal) === -1
                ? clipboardValue
                : clipboardValue.indexOf(this.options.decimal) !== -1
                ? clipboardValue.slice(
                    0,
                    clipboardValue.indexOf(this.options.decimal)
                  )
                : clipboardValue
            );
          }
        } else {
          if (
            clipboardValue.charAt(0) === this.options.decimal &&
            event.target.selectionStart !== event.target.selectionEnd &&
            (selectedValue.indexOf(this.options.decimal) !== -1 ||
              this.element.value.indexOf(this.options.decimal) === -1)
          ) {
            valueToPaste = this.getValueByMaxLength(event, clipboardValue);
          } else {
            valueToPaste = [
              this.element.value.slice(0, event.target.selectionStart),
              EMPTY_STRING,
              this.element.value.slice(event.target.selectionEnd),
            ].join(EMPTY_STRING);
          }
        }
        if (valueToPaste === MINUS) {
          valueToPaste = EMPTY_STRING;
        }
        if (
          isMinus &&
          !this.IsEmptyOrWhiteSpace(valueToPaste) &&
          valueToPaste.charAt(0) !== MINUS
        ) {
          valueToPaste = MINUS + valueToPaste;
        }
        this.writeValue(valueToPaste);
        const modelValue: string | null = this.transformBack(valueToPaste, true);
        this.updateModel(
          this.IsEmptyOrWhiteSpace(modelValue) ? undefined : modelValue,
          true
        );
      }
      event.preventDefault();
    }
  
    @HostListener('keyup', ['$event'])
    onkeyup(event: any): void {
      this.isFocus = false;
      if (
        !event.target.hasAttribute('readOnly') &&
        event.target.value.indexOf(DOT) !== -1
      ) {
        this.writeValue(event.target.value.replace(DOT, this.options.decimal));
      }
    }
  
    @HostListener('keypress', ['$event'])
    onkeydown(event: any): void {
      this.isFocus = false;
      const keyEvent: KeyboardEvent = <KeyboardEvent>event;
      const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (event.target.hasAttribute('readOnly')) {
        return;
      }
  
      // Blcok more than one Dot or Comma
      if (
        ((!isFireFox && [44, 46].indexOf(keyEvent.keyCode) !== -1) ||
          (isFireFox && [44, 46].indexOf(keyEvent.charCode) !== -1)) &&
        event.target.value.indexOf(this.options.decimal) !== -1
      ) {
        keyEvent.preventDefault();
      }
  
      // Allow enter Dot and Comma in other browsers except FireFox
      if ([13, 44, 46].indexOf(event.keyCode) !== -1) {
        return;
      }
  
      // in FireFox
      if (
        isFireFox &&
        ([8, 9, 44, 46].indexOf(event.keyCode) !== -1 ||
          [44, 46].indexOf(event.charCode) !== -1 || // Allow Dot and Comma
          (event.keyCode >= 33 && event.keyCode <= 40) || // Allow Home, End, Page up and Page down
          event.ctrlKey ||
          event.metaKey)
      ) {
        return;
      }
      const isMinusKey =
        this.options.allowNegative &&
        ([45, 95].indexOf(event.keyCode) !== -1 ||
          (isFireFox && [45, 95].indexOf(event.charCode) !== -1));
      // minus or hypen symbol key
      if (isMinusKey) {
        if (
          !keyEvent.shiftKey &&
          (<string>event.target.value).indexOf(MINUS) === -1
        ) {
          this.writeValue(MINUS + (<HTMLInputElement>event.target).value.trim());
          const modelValue: string | null = this.transformBack(
            (<HTMLInputElement>event.target).value,
            true
          );
          this.updateModel(
            this.IsEmptyOrWhiteSpace(modelValue) ? undefined : modelValue
          );
          keyEvent.preventDefault();
          return;
        }
        keyEvent.preventDefault();
      }
  
      // plus symbol key
      if (
        (keyEvent.keyCode === 43 || (isFireFox && keyEvent.charCode === 43)) &&
        (<string>event.target.value).charAt(0) === MINUS
      ) {
        this.writeValue(
          (<HTMLInputElement>event.target).value.replace(MINUS, EMPTY_STRING)
        );
        const modelValue: string |null  = this.transformBack(
          (<HTMLInputElement>event.target).value,
          true
        );
        this.updateModel(
          this.IsEmptyOrWhiteSpace(modelValue) ? undefined : modelValue
        );
      }
  
      // ensure that it is a number and stop the keypress
      const numberPattern = /^[0-9]*$/g;
      numberPattern.lastIndex = 0;
      if (!numberPattern.test(event.key)) {
        event.preventDefault();
      }
  
      // don't allow to enter left value once the length reaches max length value
      if (
        !this.isCursorInFractionalSection(event) &&
        parseInt(event.target.value, 10).toString().length >=
          this.options.maxLength &&
        (<any>keyEvent.currentTarget).selectionStart ===
          (<any>keyEvent.currentTarget).selectionEnd
      ) {
        keyEvent.preventDefault();
      }
  
      // don't allow to enter value after NEGATIVE sign
      if (
        (<HTMLInputElement>event.target).value.indexOf(MINUS) !== -1 &&
        (<any>keyEvent.currentTarget).selectionStart === 0 &&
        (<any>keyEvent.currentTarget).selectionEnd === 0
      ) {
        keyEvent.preventDefault();
      }
    }
  
    /**
     * this method is used to verify the cursor is placed in fractional part.
     * @param event
     */
    private isCursorInFractionalSection(event: any): boolean {
      return (
        event.target.value.indexOf(this.options.decimal) !== -1 &&
        event.target.selectionStart >
          event.target.value.indexOf(this.options.decimal)
      );
    }
  
    private getExtractedValue(value: string): string {
      let extractedValue = '';
      let decimalCount = 0;
      for (let index = 0; index < value.length; index++) {
        if (
          value.charAt(index) === this.options.decimal ||
          value.charAt(index) === this.options.thousands
        ) {
          if (value.charAt(index) === this.options.decimal) {
            decimalCount += 1;
          }
          if (
            decimalCount > 1 ||
            ((decimalCount === 1 || index === 0) &&
              value.charAt(index) === this.options.thousands)
          ) {
            break;
          }
        }
        if (
          (value.charAt(index) === MINUS &&
            index === 0 &&
            this.options.allowNegative) ||
          value.charAt(index) === this.options.decimal ||
          value.charAt(index) === this.options.thousands ||
          !isNaN(<any>value.charAt(index))
        ) {
          extractedValue += value.charAt(index);
        } else {
          break;
        }
      }
      return extractedValue.replace(
        new RegExp('\\' + this.options.thousands, 'g'),
        EMPTY_STRING
      );
    }
  
    private getValueByMaxLength(event: any, clipboardValue: string): string {
      let valueToPaste: string = [
        this.element.value.slice(0, event.target.selectionStart),
        clipboardValue,
        this.element.value.slice(event.target.selectionEnd),
      ].join(EMPTY_STRING);
      if (this.isValueExceedMaxLength(valueToPaste)) {
        valueToPaste = [
          this.element.value.slice(0, event.target.selectionStart),
          clipboardValue.slice(
            0,
            valueToPaste.length - this.options.maxLength - 1
          ),
          this.element.value.slice(event.target.selectionEnd),
        ].join(EMPTY_STRING);
      }
      return valueToPaste;
    }
  
    /**
     * set the default options for currency display format
     * default maxLenth value is (19)
     * default prefix value is ('')
     * default decimal value is (,)
     * default precision value is (2)
     * default thousands value is (.)
     * default allowNegative value is false
     */
    private setDefaultOptions(): void {
      if (!this.options) {
        this.options = <any>{};
      }
      if (this.options.maxLength === undefined || this.options.maxLength === 0) {
        this.options.maxLength = 15;
      }
      if (!this.options.prefix) {
        this.options.prefix = '';
      }
      if (!this.options.decimal) {
        this.options.decimal = ',';
      }
      if (!this.options.precision && this.options.precision !== 0) {
        this.options.precision = 2;
      }
      if (!this.options.thousands) {
        this.options.thousands = DOT;
      }
      if (this.options.allowNegative === undefined) {
        this.options.allowNegative = false;
      }
      if (this.options.nullable === undefined) {
        this.options.nullable = false;
      }
    }
  
    /**
     * change the input to currency format string
     * @param value It will be a number. Example: 99999999.99
     * @returns The reutrn value will be a string. Example: 99999999,99 => 99 999 999,99
     */
    private transform(value: number | string): string  {
      if (
        value &&
        value.toString().trim().length === 1 &&
        value.toString().trim() == MINUS
      ) {
        return value.toString();
      }
      if (this.options.decimal === this.options.thousands) {
        throw new Error(
          `The options decimal => '${this.options.decimal}' and  thousands => '${this.options.thousands}' should not be same.`
        );
      }
      const digitsFormat = `1.${this.options.precision}-${this.options.precision}`;
      let transformedValue: string |undefined = this.IsEmptyOrWhiteSpace(value)
        ? this.options.nullable
          ? undefined
          : DEFAULT_VALUE
        : value
            .toString()
            .replace(this.options.decimal, DOT)
            .replace(/\s/g, EMPTY_STRING);
      if (
        !(
          (transformedValue === undefined || transformedValue === null) &&
          this.options.nullable
        )
      ) {
        transformedValue =
          this.IsEmptyOrWhiteSpace(transformedValue) || transformedValue === DOT
            ? DEFAULT_VALUE
            : this.decimalPipe
                .transform(transformedValue, digitsFormat, 'fr')?.trim()
                .replace(',', this.options.decimal)
                .replace(/\s/g, this.options.thousands);
      }
      if (
        !(transformedValue === undefined || transformedValue === null) &&
        !this.options.allowNegative &&
        transformedValue !== DEFAULT_VALUE &&
        transformedValue.indexOf(MINUS) !== -1
      ) {
        transformedValue = transformedValue.replace(MINUS, EMPTY_STRING);
      }
      
      return (transformedValue == undefined) ? '' : transformedValue ;
    }
  
    /**
     * change the currecny format string to number format string. This will remove the thousands separator and return the string. Example: 999 999,99(input) =>
     * 999999,99(Output)
     * @param value It will be a string. Example: 9 999 999 999,999
     * @param needNumber Default value is false. It will return the pure number
     * @returns it will be a string value. Example: 9999999999999,99
     */
    private transformBack(value: string | null | undefined, needNumber: boolean = true): string | null {
      if (value && value.trim().length === 1 && value.trim() === MINUS) {
        return EMPTY_STRING;
      }
      if (this.options.decimal === this.options.thousands) {
        throw new Error(
          `The options decimal => '${this.options.decimal}' and  thousands => '${this.options.thousands}' should not be same.`
        );
      }
      const digitsFormat = `1.${this.options.precision}-${this.options.precision}`;
      let transformedValue: string |undefined | null = this.IsEmptyOrWhiteSpace(value)
        ? EMPTY_STRING
        : value
            ?.replace(new RegExp('\\' + this.options.thousands, 'g'), EMPTY_STRING)
            .replace(this.options.decimal, DOT)
            .trim();
      transformedValue =
        this.IsEmptyOrWhiteSpace(transformedValue) || transformedValue === DOT
          ? this.options.nullable
            ? EMPTY_STRING
            : '0'
          : transformedValue;
      transformedValue = this.decimalPipe.transform(
        transformedValue,
        digitsFormat,
        'fr'
      );
      transformedValue = transformedValue
        ? transformedValue.replace(/\s/g, EMPTY_STRING).trim()
        : transformedValue;
      if (
        !this.options.allowNegative &&
        !this.IsEmpty(transformedValue) &&
        transformedValue?.indexOf(MINUS) !== -1
      ) {
        transformedValue = transformedValue
          ? transformedValue.replace(MINUS, EMPTY_STRING)
          : transformedValue;
      }
      if (needNumber) {
        transformedValue = transformedValue
          ? transformedValue.replace(this.options.decimal, DOT)
          : transformedValue;
      }
      if (
        !this.options.nullable &&
        !needNumber &&
        this.isZero(transformedValue)
      ) {
        return EMPTY_STRING;
      }
      return transformedValue;
    }
  
    private writeValue(
      value: string| null,
      forceEmpty: boolean = false,
      initValue: boolean = false
    ): void {
      if (
        !value &&
        !this.options.nullable &&
        !forceEmpty &&
        !(initValue && this.options.IspropertyNullable)
      ) {
        if (this.options.canRoundOff) {
          value = '0';
        } else {
          value = '0,00';
        }
      }
      if (this.model && this.model.name) {
        if (!this.options.canRoundOff) {
          this.model.valueAccessor?.writeValue(value);
        } else if (value) {
            const transformBackValue = this.transformBack(value.toString(), true)
            if(transformBackValue){
                this.model.valueAccessor?.writeValue(
            
                    this.transform(
                      Math.round(+transformBackValue)
                    )?.replace(',00', '')
                  );
            }
         
        }
      } else {
        if (value != '0.00') {
          const temp1Value: any = this.transformBack(value);
  
          if (temp1Value == 0 || temp1Value == 0.0 || temp1Value == '0,00') {
            this.ngModelChange.emit(temp1Value);
          } else {
            const tempt2val: number = temp1Value
              ? parseFloat(temp1Value)
              : temp1Value;
            this.ngModelChange.emit(tempt2val);
          }
  
          /*setTimeout(() => {*/
            if (value) {
              if (this.isFocus) {
                this.element.value = value.toString().replace('.', ',');
              } else {
                if (value) this.element.value = value.toString();
              }
            }
         /* }, 1);*/
        }
      }
    }
  
    private updateModel(
      value: string | number | undefined | null,
      forceEmitEvent: boolean = false
    ): void {
      if (this.model && this.model.name) {
        let modelValue: any =
          this.isNumber && !(value === undefined || value === null)
            ? Number(value).valueOf()
            : value;
        if (!modelValue && !this.options.nullable) {
          modelValue = 0;
        }
        if (forceEmitEvent) {
          this.isEmitted = true;
          this.model.control.setValue(modelValue, {
            emitViewToModelChange: true,
          });
        } else {
          this.model.viewToModelUpdate(modelValue);
        }
      }
    }
  
    private isValueExceedMaxLength(value: string): boolean {
      const extractedValue: string = value
        .slice(0, value.indexOf(this.options.decimal))
        .replace(new RegExp('\\' + this.options.thousands, 'g'), EMPTY_STRING)
        .replace(MINUS, EMPTY_STRING);
      return extractedValue.length > this.options.maxLength;
    }
  
    private isZero(value: string | undefined | null): boolean | string | undefined | null {
      return (
        value &&
        !isNaN(Number(value.toString().replace(this.options.decimal, DOT))) &&
        parseFloat(
          Number(value.toString().replace(this.options.decimal, DOT)).toFixed(
            this.options.precision
          )
        ) === 0
      );
    }
  
    /**
     * applyMask and clearMask methods are here just for reference. Instead of these methods this directive is using the transform and transformBack methods respectively.
     */
  
    /**
     * applyMask method referred from ngCurrencyMask angular control.
     * @param rawValue
     * @param isNumber
     */
    private applyMask(rawValue: string, isNumber: boolean = false): string {
      rawValue = isNumber
        ? Number(rawValue).toFixed(this.options.precision)
        : rawValue;
      const onlyNumbers: string = rawValue.replace(/[^0-9]/g, '');
  
      if (!onlyNumbers) {
        return '';
      }
  
      let integerPart: string = onlyNumbers
        .slice(0, onlyNumbers.length - this.options.precision)
        .replace(/^0*/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, this.options.thousands);
  
      if (integerPart === '') {
        integerPart = '0';
      }
  
      let newRawValue: string = integerPart;
      let decimalPart: string = onlyNumbers.slice(
        onlyNumbers.length - this.options.precision
      );
  
      if (this.options.precision > 0) {
        decimalPart =
          '0'.repeat(this.options.precision - decimalPart.length) + decimalPart;
        newRawValue += this.options.decimal + decimalPart;
      }
  
      const isZero: boolean =
        parseInt(integerPart, 10) === 0 &&
        (parseInt(decimalPart, 10) === 0 || decimalPart === '');
      const operator: string =
        rawValue.indexOf('-') > -1 && this.options.allowNegative && !isZero
          ? '-'
          : '';
      return operator + newRawValue;
    }
  
    /**
     * clearMask method referred from ngCurrencyMask angular control
     * @param rawValue
     */
    private clearMask(rawValue: string): number | null {
      if (rawValue === null || rawValue === '') {
        return null;
      }
  
      let value: string = rawValue;
  
      if (this.options.thousands) {
        value = value.replace(new RegExp('\\' + this.options.thousands, 'g'), '');
      }
  
      if (this.options.decimal) {
        value = value.replace(this.options.decimal, '.');
      }
  
      return parseFloat(value);
    }
    IsEmpty(value: any) {
      return value === undefined || value === '' || value === null;
    }
    IsEmptyOrWhiteSpace(value: any) {
      return this.IsEmpty(value) || this.IsEmpty(value.toString().trim());
    }
  }
