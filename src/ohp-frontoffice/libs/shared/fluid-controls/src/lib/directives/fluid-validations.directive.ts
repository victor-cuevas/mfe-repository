import { Input, Directive, SimpleChanges, SimpleChange, ElementRef, AfterViewInit } from '@angular/core';

import { ValidationErrorDto } from '../models/models';
import { OnChanges } from '@angular/core';
import { HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { fluidValidationService } from '../services/fluid-validation.service';


@Directive({
  selector: '[cfcFluidValidation]',
  providers: [DecimalPipe]
})
export class FluidValidationsDirective implements OnChanges, AfterViewInit {
  @Input('cfcFluidValidation') fluidValidation: any;
  hasFocus = false;
  constructor(public element: ElementRef, public ngModel: NgModel, public validationService: fluidValidationService,
    public decimalPipe: DecimalPipe) {
  }

  ngAfterViewInit() {
    if (!this.validationService.IsNativeHTMLControl((<HTMLElement>this.element.nativeElement).nodeName.toLowerCase())) {
      const htmlElement: Element | undefined = this.validationService.GetNativeHTMLControlElement((<HTMLElement>this.element.nativeElement));
      if (htmlElement) {
        htmlElement.addEventListener('focus', this.onFocus.bind(this));
        htmlElement.addEventListener('blur', this.onBlur.bind(this));
      }
    }
  }
  @HostListener('focus')
  onFocus(target: any) {

    this.hasFocus = true;
  }
  @HostListener('blur')
  onBlur(target: any) {

    this.hasFocus = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const fluidValidation: SimpleChange = <SimpleChange>changes.fluidValidation;

      if (fluidValidation.currentValue && fluidValidation.currentValue.errors.length > 0 && fluidValidation.currentValue.formSubmitted) {
        if (!fluidValidation.firstChange) {

          fluidValidation.currentValue.errors?.forEach((x: any) => {
            if (x.validation == 'required') {
              this.AddValidationError('required', x.validationMessage);
            } else {
              this.RemoveValidationError('required');
            }
            if (x.validation == 'minError') {
              this.AddValidationError('minError', x.validationMessage);
            } else {
              this.RemoveValidationError('minError');
            }
            if (x.validation == 'maxError') {
              this.AddValidationError('maxError', x.validationMessage);
            } else {
              this.RemoveValidationError('maxError');
            }
          });


        }
      } else {
        const existingErrors = this.validationService.FluidBaseValidationService.ValidationErrorList?.filter(x => x.Element === this.element);
        if (existingErrors) {
          for (const existingError of existingErrors) {
            const existingErrorIndex = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.Element === existingError.Element);
            this.validationService.FluidBaseValidationService.ValidationErrorList.splice(existingErrorIndex, 1);
          }
        }


      }

    }
  }

  AddValidationError(validationName: string, validationMesage: string) {
    let errorMessage: string | undefined;
    const label = this.fluidValidation.label;

    switch (validationName) {
      case 'required':
        errorMessage = validationMesage;
        break;


      default:
        errorMessage = validationMesage;
    }
    if (!this.validationService.FluidBaseValidationService.ValidationErrorList || this.validationService.FluidBaseValidationService.ValidationErrorList?.length == 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList = [];
    }
    const existingErrorIndex = this.validationService.FluidBaseValidationService.ValidationErrorList?.findIndex(x => x.Element === this.element && x.Validator === validationName);
    if (existingErrorIndex !== -1) {
      this.validationService.FluidBaseValidationService.ValidationErrorList?.splice(existingErrorIndex, 1);
    }

    this.validationService.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(errorMessage, false, validationName, this.element));

  }

  RemoveValidationError(validationName: string) {
    const existingErrorIndex = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.Element === this.element && x.Validator === validationName);
    if (existingErrorIndex !== -1) {
      this.validationService.FluidBaseValidationService.ValidationErrorList?.splice(existingErrorIndex, 1);
    }

  }

  GetErrorMessage(): string | null {
    let errorMessage = '';
    const validationErrorMessages = this.validationService.FluidBaseValidationService.ValidationErrorList
      .filter(error => !error.IsBusinessError && error.Element && this.element && error.Element.nativeElement === this.element.nativeElement)
      .map(error => error.ErrorMessage);
    if (validationErrorMessages.length > 0) {
      const numberOfErrors = validationErrorMessages.length;
      validationErrorMessages.forEach((error, index) => {
        errorMessage += error;
        if (index !== numberOfErrors - 1) {
          errorMessage += '<br>';
        }
      });
      return errorMessage;
    } else {
      return null;
    }
  }

}
