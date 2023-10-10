import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { ValidationErrorDto } from '../models/models';
import { fluidValidationService } from '../services/fluid-validation.service';

@Component({
  selector: 'cfc-fluid-validation-error',
  templateUrl: './fluid-validation-error.component.html' 
})
export class FluidValidationErrorComponent implements OnInit,AfterViewChecked {

  ValidationErrorList: ValidationErrorDto[]=[];
  constructor(private validationStateService:fluidValidationService) { }

  @Input() Header !: string 
  validation!: string;
  ngOnInit(): void {
    this.validation="Test";
  }

  ngAfterViewChecked() {
    setTimeout((_: any) => this.ValidationErrorList = this.validationStateService.FluidBaseValidationService.ValidationErrorList)
  }


  GetValidationMessage() {
 
   return this.validationStateService.FormatString(this.Header,this.ValidationErrorList.length.toString())
 }

 ValidationErrorSelectionChange(validationError: ValidationErrorDto) {
  if (validationError && validationError.Element && !validationError.IsBusinessError) {
    if(document.getElementsByClassName('p-tabview-panels').length>0){
      const selectedParentTabIndex = Array.from( document.getElementsByClassName('p-tabview-panels')[0].children).indexOf((validationError.Element.nativeElement).closest('p-tabpanel'));
      if (selectedParentTabIndex !== -1) {
        this.validationStateService.ActivateTabOfControl(selectedParentTabIndex);
      }
    } 
    setTimeout(() => {
          if (this.validationStateService.IsNativeHTMLControl((<HTMLElement>validationError.Element?.nativeElement).nodeName)) {
              validationError.Element?.nativeElement.focus();
          } else {
              const elements: HTMLCollectionOf<Element> = (<HTMLElement>validationError.Element?.nativeElement).getElementsByTagName('input');
              if (elements.length > 0) {
                  (<HTMLInputElement>elements.item(0)).focus();
              }
          }
    });
  }
}

}
