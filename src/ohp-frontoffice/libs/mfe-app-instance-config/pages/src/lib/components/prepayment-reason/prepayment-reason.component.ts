import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { TranslateService } from '@ngx-translate/core';
import { prepaymentReasonDef } from './Models/prepaymentReasonDef';
import { PrepaymentReasonService } from './Service/prepayment-reason-service.service';
import { stateModel } from './Models/state.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';


@Component({
  selector: 'maic-prepayment-reason',
  templateUrl: './prepayment-reason.component.html',
  styleUrls: ['./prepayment-reason.component.scss']
})
export class PrepaymentReasonComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  show!: boolean;
  exceptionBox!: boolean
  RevisionHeader:any
  prePaymentReason: prepaymentReasonDef[] = []
  navigateUrl!: string
  errorCode!:string

 
  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public prePaymentReasonService: PrepaymentReasonService, public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl

  }

  changeCalculatePrepaymentPenalty(event: any, index: number) {

    this.prePaymentReason[index].state = stateModel.Dirty

    if (event != null) {

      if(event){
        this.prePaymentReason[index].CalculatePrepaymentPenalty = event;
        this.prePaymentReason[index].isPenaltyReadOnly = false;
      }else{
        this.prePaymentReason[index].CalculatePrepaymentPenalty = event;
        this.prePaymentReason[index].isPenaltyReadOnly = true;
      }
     
    }
  }

  changeMaximumPenaltyPercentage(event: any, index: number,ischanged:boolean) {

    this.prePaymentReason[index].state = stateModel.Dirty
    if (event != null) {

      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.prePaymentReason[index].MaximumPenaltyPercentage = parseFloat(floatValue);
      }
     

    }
    else {
      this.prePaymentReason[index].MaximumPenaltyPercentage = null as unknown as number;

    }
  }

  onclose() {

    const unsaved = this.prePaymentReason.findIndex(x => {
      return x.state == stateModel.Dirty
    })
    if (unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(saveData: prepaymentReasonDef[]) {
    this.show = false;
    this.onSave(saveData);
    window.location.assign(this.navigateUrl);

  }
  onNo() {
    this.show = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
   this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(saveData: prepaymentReasonDef[]) {
    
      this.spinnerService.setIsLoading(true);
      this.prePaymentReasonService.PutPrePaymentReasonResponse(saveData).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {

          this.show = false;

          this.prePaymentReasonService.GetPrePaymentReasonResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res.map((x: any) => {
              if (x.calculatePrepaymentPenalty) {
                x.isPenaltyReadOnly = false;
              } else {
                x.isPenaltyReadOnly = true;
              }
              return { ...x };
            });
            this.prePaymentReason = getResponse ;
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

  ngOnInit(): void {
    
    this.RevisionHeader = [
      { header: this.translate.instant('app-instance.prepayment-reason.tabel.prepaymentName'), field: 'prepaymentReason.caption', width: '', property:'stringList' },
      { header: this.translate.instant('app-instance.prepayment-reason.tabel.calculatePenality'), field: 'calculatePrepaymentPenalty', width: '', property: 'checkboxList', pSortableColumnDisabled:true },
      { header: this.translate.instant('app-instance.prepayment-reason.tabel.MaxPenality'), field: 'maximumPenaltyPercentage', width: '', property: 'amountText', pSortableColumnDisabled: true}];


    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      if (res) {
        this.prePaymentReason = res.prePaymentReasonData.map((x:any)=>{
          if(x.calculatePrepaymentPenalty){
            x.isPenaltyReadOnly= false;
          }else{
            x.isPenaltyReadOnly= true;
          }
          return {...x}
        })
      }
    })
  }


}
