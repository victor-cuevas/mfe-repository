import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from './service/general-service.service';
import { ActivatedRoute } from '@angular/router';
import { creditSettings } from './Models/creditSettings.model';
import { stateModel } from './Models/state.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';


@Component({
  selector: 'maic-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public HighestRevisionPeriodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  Header = this.translate.instant('app-instance.validation.validationHeader');
  show!: boolean;
  exceptionBox!: boolean
  isErrors!: boolean
  maxvalue = 2147483647
  creditSettingResponse!: creditSettings
  navigateUrl!: string
  errorCode!:string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public generalService: GeneralService, public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  changeRateRevisionPeriod(event: any) {

    this.creditSettingResponse.state = stateModel.Dirty;
    if (event != null && event <= this.maxvalue) {

      this.creditSettingResponse.rateRevisionPeriod = parseInt(event);
    }
    else {
      this.creditSettingResponse.rateRevisionPeriod = event;
      setTimeout(() => {
        this.creditSettingResponse.rateRevisionPeriod = 0;
      }, 10)
    }

  }

  changeHighestRevisionPeriod(event: any) {

    this.creditSettingResponse.state = stateModel.Dirty;

    if (event?.value != null) {

      this.creditSettingResponse.highestRevisionPeriodMethod = event?.value;

     }
    else {
      this.HighestRevisionPeriodDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      if (res) {
        this.creditSettingResponse = res.creditSettingData
      }
    })
  }

  onclose() {
   
    if (this.creditSettingResponse.state == stateModel.Dirty) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(saveData: creditSettings) {
    this.show = false;
    this.onSave(saveData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.HighestRevisionPeriodDropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  onSave(saveData: creditSettings) {
    if (this.userDetailsform.valid) {

      this.isErrors = false;
      this.spinnerService.setIsLoading(true);
      this.generalService.PutCreditSettingResponse(saveData).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {

          this.show = false;

          this.generalService.GetCreditSettingResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as creditSettings
            this.creditSettingResponse = { ...getResponse };

            this.HighestRevisionPeriodDropdownConfig.externalError = false;
            
          },
            err => {
              if (err?.error?.errorCode) {
                this.errorCode = err.error.errorCode;
              }
              else {
                this.errorCode = "InternalServiceFault"
              }
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            })

        }

      },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
        })

    }
    else {
      this.isErrors = true;
      this.HighestRevisionPeriodDropdownConfig.externalError = true;
    }
  }

  buildConfiguration() {

    const highrevRequired = new ErrorDto;
    highrevRequired.validation = "required";
    highrevRequired.isModelError = true;
    highrevRequired.validationMessage = this.translate.instant('app-instance.general.mandatory.HighestRevision') + this.translate.instant('app-instance.general.mandatory.required');
    this.HighestRevisionPeriodDropdownConfig.Errors = [highrevRequired];
    this.HighestRevisionPeriodDropdownConfig.required = true

  }
}
