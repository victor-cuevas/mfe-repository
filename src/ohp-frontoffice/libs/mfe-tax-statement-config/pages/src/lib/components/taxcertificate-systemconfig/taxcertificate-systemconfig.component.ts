import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { codeTable } from './Models/codeTable.model';
import { TaxCertificateSystemConfigDto } from './Models/taxcertificate-systemconfigDto.model';
import { DtoState } from './Models/dtoBase.model';
import { TaxcertificateSystemconfigService } from './Services/taxcertificate-systemconfig.service';
import { ConfigContextService } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';

@Component({
  selector: 'mtsc-taxcertificate-systemconfig',
  templateUrl: './taxcertificate-systemconfig.component.html',
  styleUrls: ['./taxcertificate-systemconfig.component.scss']
})
export class TaxcertificateSystemconfigComponent implements OnInit {
  @ViewChild('systemConfigform', { static: true }) systemConfigform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredCutoffDay : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredCutoffPreviousYear : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredFirstDayofYearChange : FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredReporterName: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredCompanyNumber : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredRelationNumber : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredMaxNumberOfRootObjects : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredAnnual : FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  taxcertificateSystemConfig: TaxCertificateSystemConfigDto = new TaxCertificateSystemConfigDto();
  communicationMediumList: codeTable[] = [];
  validationHeader!: string;
  intMaxValue = 2147483647;
  cutoffMaxDto :ErrorDto[]=[];
  cutoffPreviousYearDto: ErrorDto[]=[];
  maxnoofrootObjectDto : ErrorDto[] =[];
  showDialog = false;
  navigateURL: any;
  exceptionBox!: boolean;
  errorCode!: string;

  constructor(public fluidService: FluidControlsBaseService, 
    public translate: TranslateService,
     public activatedRoute: ActivatedRoute,
     public systemConfigService:TaxcertificateSystemconfigService,
     public commonService: ConfigContextService,
     public spinnerService:SpinnerService
     ) {
    this.validationHeader = this.translate.instant('tax-statement.Validation.Header');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.communicationMediumList = data.communicationMedium;
      this.taxcertificateSystemConfig = data.taxCertificateSystemConfig;
    });
  }

  buildConfiguration(){
    const cutOffMaxValidation = new ErrorDto();
    cutOffMaxValidation.validation = 'maxError';
    cutOffMaxValidation.isModelError = true;
    cutOffMaxValidation.validationMessage = this.translate.instant('tax-statement.taxcertificate.ValidationError.numberInt32Check');
    this.cutoffMaxDto = [cutOffMaxValidation];
    const cutoffMaxValueError = new ErrorDto();
    cutoffMaxValueError.validation = 'required';
    cutoffMaxValueError.isModelError = true;
    cutoffMaxValueError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.Cutoffdays') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredCutoffDay.required = true;
    this.RequiredCutoffDay.Errors = [cutoffMaxValueError];
    this.RequiredCutoffDay.maxValueValidation = this.translate.instant('tax-statement.taxcertificate.ValidationError.InputIncorrect');

    const CutoffPreviousYearMaxValidation = new ErrorDto();
    CutoffPreviousYearMaxValidation.validation = 'maxError';
    CutoffPreviousYearMaxValidation.isModelError = true;
    CutoffPreviousYearMaxValidation.validationMessage = this.translate.instant('tax-statement.taxcertificate.ValidationError.numberInt32Check');
    this.cutoffPreviousYearDto = [CutoffPreviousYearMaxValidation];
    const cutoffPreviousYearError = new ErrorDto();
    cutoffPreviousYearError.validation = 'required';
    cutoffPreviousYearError.isModelError = true;
    cutoffPreviousYearError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.CutoffdaysPreviousYear') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredCutoffPreviousYear.required = true;
    this.RequiredCutoffPreviousYear.Errors = [cutoffPreviousYearError];
    this.RequiredCutoffPreviousYear.maxValueValidation = this.translate.instant('tax-statement.taxcertificate.ValidationError.InputIncorrect');
 

    const useFirstDayofYearError = new ErrorDto();
    useFirstDayofYearError.validation = 'required';
    useFirstDayofYearError.isModelError = true;
    useFirstDayofYearError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.UseFirst') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredFirstDayofYearChange.required = true;
    this.RequiredFirstDayofYearChange.Errors = [useFirstDayofYearError];

    const reporterNameError = new ErrorDto();
    reporterNameError.validation = 'required';
    reporterNameError.isModelError = true;
    reporterNameError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.ReporterName') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredReporterName.required = true;
    this.RequiredReporterName.Errors = [reporterNameError];

    const companyNumberError = new ErrorDto();
    companyNumberError.validation = 'required';
    companyNumberError.isModelError = true;
    companyNumberError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.ReporterCompanyNumber') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredCompanyNumber.required = true;
    this.RequiredCompanyNumber.Errors = [companyNumberError];

    const relationalNumberError = new ErrorDto();
    relationalNumberError.validation = 'required';
    relationalNumberError.isModelError = true;
    relationalNumberError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.RelationNumber') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredRelationNumber.required = true;
    this.RequiredRelationNumber.Errors = [relationalNumberError];

    const MaxNumberOfRootValidation = new ErrorDto();
    MaxNumberOfRootValidation.validation = 'maxError';
    MaxNumberOfRootValidation.isModelError = true;
    MaxNumberOfRootValidation.validationMessage = this.translate.instant('tax-statement.taxcertificate.ValidationError.numberInt32Check');
    this.maxnoofrootObjectDto = [MaxNumberOfRootValidation];
    const maxNumberOfRootValidationError = new ErrorDto();
    maxNumberOfRootValidationError.validation = 'required';
    maxNumberOfRootValidationError.isModelError = true;
    maxNumberOfRootValidationError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.Maxnumber') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredMaxNumberOfRootObjects.required = true;
    this.RequiredMaxNumberOfRootObjects.Errors = [maxNumberOfRootValidationError];
    this.RequiredMaxNumberOfRootObjects.maxValueValidation = this.translate.instant('tax-statement.taxcertificate.ValidationError.InputIncorrect');

    const AnnualError = new ErrorDto();
    AnnualError.validation = 'required';
    AnnualError.isModelError = true;
    AnnualError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.Communication') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredAnnual.required = true;
    this.RequiredAnnual.Errors = [AnnualError];
  }

  onCutOffDayChange(event: any) {
    if (event != null && event != '') {
      if (+event > this.intMaxValue) {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.cutOffDays = +event;
        this.RequiredCutoffDay.externalError = true;
      } else {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.cutOffDays = +event;
      }
    } else {
      if (this.taxcertificateSystemConfig.state != DtoState.Created) {
        this.taxcertificateSystemConfig.state = DtoState.Dirty;
      }
      this.taxcertificateSystemConfig.cutOffDays = null;
      this.RequiredCutoffDay.externalError = true;
    }

  }
  onCutoffdaysPreviousYearChange(event: any) {
    if (event != null && event != '') {
      if (+event > this.intMaxValue) {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.cutOffDaysPreviousYear = +event;
        this.RequiredCutoffPreviousYear.externalError = true;
      } else {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.cutOffDaysPreviousYear = +event;
      }
    } else {
      if (this.taxcertificateSystemConfig.state != DtoState.Created) {
        this.taxcertificateSystemConfig.state = DtoState.Dirty;
      }
      this.taxcertificateSystemConfig.cutOffDaysPreviousYear = null;
      this.RequiredCutoffPreviousYear.externalError = true;
    }

  }

  onFirstDayofYearChange(event: any) {
    if (this.taxcertificateSystemConfig.state != DtoState.Created) {
      this.taxcertificateSystemConfig.state = DtoState.Dirty;
    }

    if (event != null) {
      this.taxcertificateSystemConfig.useFirstDayOfYearForTaxCertificate = event;
    
    }else{
      this.taxcertificateSystemConfig.useFirstDayOfYearForTaxCertificate = null;
      this.RequiredFirstDayofYearChange.externalError = true;
    }

  }

  onReporterNameChange(event:any) {
    if (event != null && event != '') {
     
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.reporterName = event;
      
    } else {
      if (this.taxcertificateSystemConfig.state != DtoState.Created) {
        this.taxcertificateSystemConfig.state = DtoState.Dirty;
      }
      this.taxcertificateSystemConfig.reporterName = null;
      this.RequiredReporterName.externalError = true;
    }

  }

  onCompanyNumberChange(event:any) {
    if (event != null && event != '') {
     
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.reporterCompanyNumber = event;
      
    } else {
      if (this.taxcertificateSystemConfig.state != DtoState.Created) {
        this.taxcertificateSystemConfig.state = DtoState.Dirty;
      }
      this.taxcertificateSystemConfig.reporterCompanyNumber = null;
      this.RequiredCompanyNumber.externalError = true;
    }

  }
  onRelationNumberChange(event:any) {
    if (event != null && event != '') {
     
      if (this.taxcertificateSystemConfig.state != DtoState.Created) {
        this.taxcertificateSystemConfig.state = DtoState.Dirty;
      }
      this.taxcertificateSystemConfig.relationNumber = event;
    
    } else {
    if (this.taxcertificateSystemConfig.state != DtoState.Created) {
      this.taxcertificateSystemConfig.state = DtoState.Dirty;
    }
    this.taxcertificateSystemConfig.relationNumber = null;
    this.RequiredRelationNumber.externalError = true;
    }

  }

  onNameLabelChange(event:any) {
    if (this.taxcertificateSystemConfig.state != DtoState.Created) {
      this.taxcertificateSystemConfig.state = DtoState.Dirty;
    }
    if(event =='' || event == null){
      this.taxcertificateSystemConfig.nameLabelForRunningAccount = null;
    }else{
      this.taxcertificateSystemConfig.nameLabelForRunningAccount = event;
    }
    
  }
  onMaxNoAnnualChange(event:any) {
      if (+event > this.intMaxValue) {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        this.taxcertificateSystemConfig.maxNumberOfRootObjectsForAnnualOverviewBatch = +event;
        this.RequiredMaxNumberOfRootObjects.externalError = true;
      } else {
        if (this.taxcertificateSystemConfig.state != DtoState.Created) {
          this.taxcertificateSystemConfig.state = DtoState.Dirty;
        }
        if(event =='' || event == null){
          this.taxcertificateSystemConfig.maxNumberOfRootObjectsForAnnualOverviewBatch = null;
          this.RequiredMaxNumberOfRootObjects.externalError = true;
        }else{
          this.taxcertificateSystemConfig.maxNumberOfRootObjectsForAnnualOverviewBatch = +event;
        }
    
      }

  }

  onCommunicationChange(event:any) {

    if (this.taxcertificateSystemConfig.state != DtoState.Created) {
      this.taxcertificateSystemConfig.state = DtoState.Dirty;
    }
    if(event.value != null){
      this.taxcertificateSystemConfig.communicationMediumForAnnualOverview = event.value;
    }else{
      this.taxcertificateSystemConfig.communicationMediumForAnnualOverview = null;
      this.RequiredAnnual.externalError = true;
    }
    

  }

  onSave(taxsystemConfig:TaxCertificateSystemConfigDto){

    if(this.systemConfigform.valid){
      if(taxsystemConfig.state == 3){
        this.systemConfigService.saveTaxCertificateSystemConfig(taxsystemConfig).subscribe((data: any) =>{
          this.spinnerService.setIsLoading(false);
          if(data){
            this.systemConfigService.getTaxCertificateSystemConfig().subscribe((responseData:any) =>{
              this.spinnerService.setIsLoading(false);
              this.taxcertificateSystemConfig = responseData;
            },err =>{
              if(err?.error?.errorCode){
                this.errorCode = err.error.errorCode;
              }else{
                this.errorCode= 'InternalServiceFault';
              }
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            })
          }
        },err =>{
          if(err?.error?.errorCode){
            this.errorCode = err.error.errorCode;
          }else{
            this.errorCode= 'InternalServiceFault';
          }
          this.spinnerService.setIsLoading(false); 
          this.exceptionBox = true;
        })
      }
    }
  }

  

  onClose() {


    if (this.taxcertificateSystemConfig.state == DtoState.Dirty || this.taxcertificateSystemConfig.state == DtoState.Created) {
      this.showDialog = true;
    } else {
      this.systemConfigform.resetForm();
      this.removeSystemConfigError();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(systemConfigData: TaxCertificateSystemConfigDto) {
    this.showDialog = false;

    if (this.systemConfigform.valid) {
        this.onSave(systemConfigData);
        this.systemConfigform.resetForm();
        this.removeSystemConfigError();
        window.location.assign(this.navigateURL);
    } else {
      this.throwSystemConfigError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.systemConfigform.resetForm();
    this.removeSystemConfigError();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }
  
  throwSystemConfigError(){
    this.RequiredCutoffDay.externalError = true;
    this.RequiredCutoffPreviousYear.externalError = true;
    this.RequiredCompanyNumber.externalError = true;
    this.RequiredFirstDayofYearChange.externalError = true;
    this.RequiredRelationNumber.externalError = true;
    this.RequiredReporterName.externalError = true;
  }
  removeSystemConfigError(){
    this.RequiredCutoffDay.externalError = false;
    this.RequiredCutoffPreviousYear.externalError = false;
    this.RequiredCompanyNumber.externalError = false;
    this.RequiredFirstDayofYearChange.externalError = false;
    this.RequiredRelationNumber.externalError = false;
    this.RequiredReporterName.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }
}
