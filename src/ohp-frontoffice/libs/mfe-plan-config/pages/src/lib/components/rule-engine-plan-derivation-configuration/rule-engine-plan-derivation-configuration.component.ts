import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ActivatedRoute } from '@angular/router';
import { RuleEngineService } from './Service/rule-engine.service';
import { ruleEnginePlanDerivationConfig } from './Models/ruleEnginePlanDerivationConfig.model';
import { treatmentPlanRef } from './Models/treatmentPlanRef.model';
import { reminderPlanRef } from '../manage-treatment-plan-config/Models/reminderPlanRef.model';
import { paymentAllocationPlanRef } from './Models/paymentAllocationPlanRef.model';
import { costPlanRef } from './Models/costPlanRef.model';
import { ruleEnginePlanDerivationCriterion } from './Models/ruleEnginePlanDerivationCriterion.model';
import { stateModel } from './Models/state.model';


@Component({
  selector: 'mpc-rule-engine-plan-derivation-configuration',
  templateUrl: './rule-engine-plan-derivation-configuration.component.html',
  styleUrls: ['./rule-engine-plan-derivation-configuration.component.scss']
})
export class RuleEnginePlanDerivationConfigurationComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public OutputTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TreatmentDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CostDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ReminderDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public PaymentDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  businessREError = this.translate.instant('plan.ruleEngine.mandatory.REError');
  businessRECError = this.translate.instant('plan.ruleEngine.mandatory.RECError');
  Header = this.translate.instant('plan.Validation.Header')
  ruleEngineListResponse: ruleEnginePlanDerivationConfig[] = [];
  deletedRecords: ruleEnginePlanDerivationConfig[] = [];
  ruleEngineTreatmentPlan: treatmentPlanRef[] = [];
  ruleEngineReminderPlan: reminderPlanRef[] = [];
  ruleEnginePaymentAllocationPlan: paymentAllocationPlanRef[] = [];
  ruleEngineCostPlan: costPlanRef[] = [];
  ruleEngineCard!: ruleEnginePlanDerivationConfig
  ruleEngineCriterionCard!: ruleEnginePlanDerivationCriterion
  indexRE:any
  indexREC: any
  ruleEngine1Header!: any[];
  ruleEngineHeader!: any[];
  NotREHide!: boolean;
  NotRECHide!: boolean;
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  errorCode!: string
  PlanFieldError ="Any one of the Plans must be added"

  
  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public ruleEngineService: RuleEngineService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  SettingREFalse() {
    this.ruleEngineListResponse.forEach(x => {
      x.isEntered = false;
    })
  }

  SettingRECFalse() {
    this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.forEach(x => {
      x.isEntered = false;

    })
  }

  planFieldsBusinessError(): boolean {
    if (this.ruleEngineListResponse.length > 0) {
      this.indexRE = this.ruleEngineListResponse.findIndex(get => {
        return get.isEntered == true;
      })

      const getIndex = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(x => {
        return !x.isDelete
      })
      if (getIndex != -1) {
        this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
          return get.isEntered == true;
        })

        const data = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC]

          if ((data.costPlan == null && data.reminderPlan == null && data.paymentAllocationPlan == null &&
            data.treatmentPlan == null) && !data.isDelete) {
            return true;
          }
          else return false;
      } else return false;
    } 
    else return false;
  }

  IsREBusinessError(): boolean {
    const filteredData = this.ruleEngineListResponse.map(item => { return item.ruleModelName });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })
    if (hasValue) {
      return true;
    } else { return false; }
  }

  IsRECBusinessError(): boolean {
    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.ruleEngineListResponse.length > 0 && this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {

      let criterionListDup: ruleEnginePlanDerivationCriterion[] = []

      criterionListDup = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.filter(x => {
        if (!x.isDelete) {
          return x
        }
        else return false;
      })

      if (criterionListDup.length > 0) {
        const filteredData = criterionListDup.map(item => { return item.output });
        const hasValue = filteredData.some(function (item, index) {
          return filteredData.indexOf(item) != index
        })
        if (hasValue) {
          return true;
        } else { return false; }
      } else { return false; }
    }  
    else return false;
  }

  changeTreatmentPlan(event: any) {
    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].treatmentPlan = event?.value;
      this.ruleEngineCriterionCard.treatmentPlan = event?.value;
      this.RemoveBusinessError(this.PlanFieldError)
    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].treatmentPlan = null as unknown as treatmentPlanRef;
      this.ruleEngineCriterionCard.treatmentPlan  = null as unknown as treatmentPlanRef;
    }
  }

  changeReminderPlan(event: any) {
    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].reminderPlan = event?.value;
      this.ruleEngineCriterionCard.reminderPlan = event?.value;
      this.RemoveBusinessError(this.PlanFieldError)

    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].reminderPlan = null as unknown as reminderPlanRef;
      this.ruleEngineCriterionCard.reminderPlan = null as unknown as reminderPlanRef;
    }
  }

  changeCostPlan(event: any) {
    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].costPlan = event?.value;
      this.ruleEngineCriterionCard.costPlan = event?.value;
      this.RemoveBusinessError(this.PlanFieldError)

    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].costPlan = null as unknown as costPlanRef;
      this.ruleEngineCriterionCard.costPlan = null as unknown as costPlanRef;
    }
  }

  changePaymentPlan(event: any) {
    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].paymentAllocationPlan = event?.value;
      this.ruleEngineCriterionCard.paymentAllocationPlan = event?.value;
      this.RemoveBusinessError(this.PlanFieldError)

    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].paymentAllocationPlan = null as unknown as paymentAllocationPlanRef;
      this.ruleEngineCriterionCard.paymentAllocationPlan = null as unknown as paymentAllocationPlanRef;
    }
  }

  changeOutput(event: any) {

    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].state = stateModel.Dirty;
    }
    if (event != null) {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].output = event;
      this.ruleEngineCriterionCard.output = event;
    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].output = null as unknown as string;
      this.ruleEngineCriterionCard.output = null as unknown as string;
      if (this.IsRECBusinessError()) {
        this.throwBusinessError(this.businessRECError);
      }
      else {
        this.RemoveBusinessError(this.businessRECError);
      }
      this.OutputTextBoxconfig.externalError = true;

    }
  }

  changeRuleName(event: any) {

    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    if (event != null) {
      this.ruleEngineListResponse[this.indexRE].ruleModelName = event;
      this.ruleEngineCard.ruleModelName = event;
    }
    else {
      this.ruleEngineListResponse[this.indexRE].ruleModelName = null as unknown as string;
      this.ruleEngineCard.ruleModelName = null as unknown as string;
      if (this.IsREBusinessError()) {
        this.throwBusinessError(this.businessREError);
      }
      else {
        this.RemoveBusinessError(this.businessREError);
      }
      this.NameTextBoxconfig.externalError = true;

    }
  }

  clickREGrid(dataselected: ruleEnginePlanDerivationConfig) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) {
          this.SettingREFalse();
          this.indexRE = this.ruleEngineListResponse.findIndex(item => {
            return item == dataselected
          })
        this.ruleEngineListResponse[this.indexRE].isEntered = true;
          this.ruleEngineCard = dataselected;

          if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0 ||
            this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {

            if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0) {
              setTimeout(() => {
                this.NotRECHide = false;
              }, 5);
            }

            else {
              const getIndex = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(x => {
                return !x.isDelete
              })
              if (getIndex == -1) {
                setTimeout(() => {
                  this.NotRECHide = false;
                }, 5);
              }
              else {
                this.SettingRECFalse();
                this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex]
                this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex].isEntered = true;
              }
            }

          }
         
        }
        else {
          if (this.IsREBusinessError())
            this.throwBusinessError(this.businessREError)

          else if (this.planFieldsBusinessError())
            this.throwBusinessError(this.PlanFieldError)

          else this.throwBusinessError(this.businessRECError) 
        }

      }
      else {
        this.setExternalErrorTrue();
      }
    }
  }

  clickRECGrid(dataselected: ruleEnginePlanDerivationCriterion) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) {
        this.SettingRECFalse();
        this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(item => {
          return item == dataselected
        })
        this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].isEntered = true;
        this.ruleEngineCriterionCard = dataselected;
         }
        else {
          if (this.IsREBusinessError())
            this.throwBusinessError(this.businessREError)

          else if (this.planFieldsBusinessError())
            this.throwBusinessError(this.PlanFieldError)

          else this.throwBusinessError(this.businessRECError)
        }

      }
      else {
        this.setExternalErrorTrue();
      }
    }
  }

  addRERow() {

    if ((this.userDetailsform.valid) ||
      this.ruleEngineListResponse.length == 0) {

      if (!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) {
        const ruleEngineObj = new ruleEnginePlanDerivationConfig ();
        this.SettingREFalse();
      ruleEngineObj.isEntered = true;
      this.ruleEngineCriterionCard = new ruleEnginePlanDerivationCriterion();
      ruleEngineObj.state = stateModel.Created;
      ruleEngineObj.pKey = 0;
      ruleEngineObj.canValidate = false;
      ruleEngineObj.rowVersion = 0;
        const newlist = this.ruleEngineListResponse;
      newlist.push({ ...ruleEngineObj });
      this.ruleEngineListResponse = [...newlist];
      this.ruleEngineCard = new ruleEnginePlanDerivationConfig();
      this.ruleEngineCard = this.ruleEngineListResponse[this.ruleEngineListResponse.length - 1]
        this.NotREHide = true;
        this.NotRECHide = false;
        this.RemoveBusinessError(this.businessREError)
        this.RemoveBusinessError(this.businessRECError)
        this.RemoveBusinessError(this.PlanFieldError)
        this.setExternalErrorFalse()
        
      }
      else {
        if (this.IsREBusinessError())
          this.throwBusinessError(this.businessREError)

        else if (this.planFieldsBusinessError())
          this.throwBusinessError(this.PlanFieldError)

        else this.throwBusinessError(this.businessRECError)
      }

    }
    else {
      this.setExternalErrorTrue();
    }
  }

  addRECRow() {

    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    if ((this.userDetailsform.valid)) {

      if (!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) {
      const ruleEngineCriterionObj = new ruleEnginePlanDerivationCriterion();
      this.SettingRECFalse();
        ruleEngineCriterionObj.isEntered = true;
        ruleEngineCriterionObj.isDelete = false;
      ruleEngineCriterionObj.state = stateModel.Created;
      ruleEngineCriterionObj.pKey = 0;
      ruleEngineCriterionObj.canValidate = false;
      ruleEngineCriterionObj.rowVersion = 0;
      const newlist = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList;
      newlist.push({ ...ruleEngineCriterionObj });
      this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList = [...newlist];
      this.ruleEngineCriterionCard = new ruleEnginePlanDerivationCriterion();
      this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length - 1];
      this.NotRECHide = true;
        this.RemoveBusinessError(this.businessREError)
        this.RemoveBusinessError(this.businessRECError)
        this.RemoveBusinessError(this.PlanFieldError)
        this.setExternalErrorFalse();
      }
      else {
        if (this.IsREBusinessError())
          this.throwBusinessError(this.businessREError)

        else if (this.planFieldsBusinessError())
          this.throwBusinessError(this.PlanFieldError)

        else this.throwBusinessError(this.businessRECError)
      }
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  onRERowDelete(event: ruleEnginePlanDerivationConfig, array: ruleEnginePlanDerivationConfig[]) {


    if (this.userDetailsform.valid || ((event.ruleModelName == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if ((!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) || ((this.IsREBusinessError() || this.IsRECBusinessError || this.planFieldsBusinessError()) && event.isEntered)) {
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.ruleEngineListResponse = [...array];
      if (this.ruleEngineListResponse.length == 0) {
          setTimeout(() => {
            this.NotREHide = false;
          }, 5);
        }
      if (this.ruleEngineListResponse.length > 0) {
          this.SettingREFalse();
        this.ruleEngineCard = this.ruleEngineListResponse[this.ruleEngineListResponse.length - 1]
        this.ruleEngineListResponse[this.ruleEngineListResponse.length - 1].isEntered = true;

        this.indexRE = this.ruleEngineListResponse.findIndex(get => {
          return get.isEntered == true;
        })
        if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0 ||
          this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {

          if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0) {
            setTimeout(() => {
              this.NotRECHide = false;
            }, 5);
          }

          else {
            const getIndex = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(x => {
              return !x.isDelete
            })
            if (getIndex == -1) {
              setTimeout(() => {
                this.NotRECHide = false;
              }, 5);
            }
            else {
              this.SettingRECFalse();
              this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex]
              this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex].isEntered = true;
            }
          }
        }
      }
        this.RemoveBusinessError(this.businessREError);
        this.RemoveBusinessError(this.businessRECError);
        this.RemoveBusinessError(this.PlanFieldError);
        this.setExternalErrorFalse()
      }
      else {
        if (this.IsREBusinessError())
          this.throwBusinessError(this.businessREError)

        else if (this.planFieldsBusinessError())
          this.throwBusinessError(this.PlanFieldError)

        else this.throwBusinessError(this.businessRECError)
      }

    }
    else {
      this.setExternalErrorTrue();
    }

  }

  onRECRowDelete(event: ruleEnginePlanDerivationCriterion, array: ruleEnginePlanDerivationCriterion[]) {

    this.indexRE = this.ruleEngineListResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.ruleEngineListResponse[this.indexRE].state == stateModel.Unknown) {
      this.ruleEngineListResponse[this.indexRE].state = stateModel.Dirty;
    }

    if (this.userDetailsform.valid || ((event.output == null || event.costPlan == null ||
      event.treatmentPlan == null|| event.reminderPlan == null || event.paymentAllocationPlan == null) && event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if ((!this.IsREBusinessError() && !this.IsRECBusinessError() && !this.planFieldsBusinessError()) || ((this.IsREBusinessError() || this.IsRECBusinessError || this.planFieldsBusinessError()) && event.isEntered)) {

        event.state = stateModel.Deleted;
        event.isDelete = true;
      
        this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList = [...array];

        if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0 ||
          this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {

          if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length == 0) {
            setTimeout(() => {
              this.NotRECHide = false;
            }, 5);
          }

          else {
           const getIndex = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(x => {
              return !x.isDelete
           })
            if (getIndex == -1) {
              setTimeout(() => {
                this.NotRECHide = false;
              }, 5);
            }
            else {
              this.SettingRECFalse();
              this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex]
              this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[getIndex].isEntered = true;
            }
          }
       
      }
        this.RemoveBusinessError(this.businessREError);
        this.RemoveBusinessError(this.businessRECError);
        this.RemoveBusinessError(this.PlanFieldError);
        this.setExternalErrorFalse()
      }
      else {
        if (this.IsREBusinessError())
          this.throwBusinessError(this.businessREError)

        else if (this.planFieldsBusinessError())
          this.throwBusinessError(this.PlanFieldError)

        else this.throwBusinessError(this.businessRECError)
      }

    }
    else {
      this.setExternalErrorTrue();
    }

  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.ruleEngine1Header = [
      { header: this.translate.instant('plan.ruleEngine.tabel.Output'), field: 'output', width: '20%',property:'outputText' },
      { header: this.translate.instant('plan.ruleEngine.tabel.TreatmentPlan'), field: 'treatmentPlan.name', width: '25%', property: 'TPText' },
      { header: this.translate.instant('plan.ruleEngine.tabel.ReminderPlan'), field: 'reminderPlan.name', width: '25%', property: 'RPText'},
      { header: this.translate.instant('plan.ruleEngine.tabel.CostPlan'), field: 'costPlan.name', width: '25%', property: 'CPText' },
      { header: this.translate.instant('plan.ruleEngine.tabel.PaymentAllocationPlan'), field: 'paymentAllocationPlan.name', width: '25%', property: 'PAText' },
      { field: 'Delete1', width: '8%', fieldType: "deleteButton", property: 'Delete', pSortableColumnDisabled: true}];

    this.ruleEngineHeader = [
      { header: this.translate.instant('plan.ruleEngine.tabel.RuleModelName'), field: 'ruleModelName', width: '95%' },
      {  field: 'Delete', width: '5%',fieldType:"deleteButton" }];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.ruleEngineData
       
        this.ruleEngineListResponse = [...getResponse];
        console.log(this.ruleEngineListResponse)
        this.deletedRecords = [...new Array<ruleEnginePlanDerivationConfig>()];
        this.indexRE = 0;
        this.indexREC = 0;
        if (this.ruleEngineListResponse.length > 0) {
          this.NotREHide = true;
          this.SettingREFalse();
          this.ruleEngineListResponse[this.indexRE].isEntered = true;
          this.ruleEngineCard = this.ruleEngineListResponse[this.indexRE];
          if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {
            this.NotRECHide = true;
            this.SettingRECFalse();
            this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].isEntered = true;
            this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC];
          }
          else {
            this.NotRECHide = false;
          }
        } else { this.NotREHide = false; }
      }
    }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.ruleEngineTreatmentPlan = res.treatmentPlan

      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.ruleEngineReminderPlan = res.reminderPlan

      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.ruleEnginePaymentAllocationPlan = res.paymentAllocation

      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.ruleEngineCostPlan = res.costPlan

      }
    })
  }

  onclose() {
    const unsaved = this.ruleEngineListResponse.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: ruleEnginePlanDerivationConfig[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {

    this.show = false;
    this.RemoveBusinessError(this.businessREError)
    this.RemoveBusinessError(this.businessRECError)
    this.RemoveBusinessError(this.PlanFieldError)
    this.setExternalErrorFalse();
    //navigate
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  onSave(GridData: ruleEnginePlanDerivationConfig[]) {

    if (this.IsREBusinessError() || this.IsRECBusinessError() || this.planFieldsBusinessError()) {
      if (this.IsREBusinessError())
        this.throwBusinessError(this.businessREError)

      else if (this.planFieldsBusinessError())
        this.throwBusinessError(this.PlanFieldError)

      else this.throwBusinessError(this.businessRECError)
       this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {

      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }

      })

      this.spinnerService.setIsLoading(true);
      this.ruleEngineService.SaveRuleEngine(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);


        this.show = false;
        this.deletedRecords = [...new Array<ruleEnginePlanDerivationConfig>()];

        this.ruleEngineService.GetRuleEngineList().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as ruleEnginePlanDerivationConfig[]
          this.ruleEngineListResponse = [...getResponse];

          this.RemoveBusinessError(this.businessREError)
          this.RemoveBusinessError(this.businessRECError)
          this.RemoveBusinessError(this.PlanFieldError)
          this.setExternalErrorFalse();

          if (this.ruleEngineListResponse.length > 0) {
            this.NotREHide = true;
            this.SettingREFalse();
            this.indexRE = this.ruleEngineListResponse.findIndex(i => {
              return (i.ruleModelName == this.ruleEngineCard.ruleModelName)
            })
            this.ruleEngineListResponse[this.indexRE].isEntered = true;
            this.ruleEngineCard = this.ruleEngineListResponse[this.indexRE]

            if (this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.length > 0) {

              this.indexREC = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList.findIndex(i => {
                return ((i.output == this.ruleEngineCriterionCard.output) &&
                  (i.treatmentPlan?.name == this.ruleEngineCriterionCard.treatmentPlan?.name) &&
                  (i.reminderPlan?.name == this.ruleEngineCriterionCard.reminderPlan?.name) &&
                  (i.costPlan?.name == this.ruleEngineCriterionCard.costPlan?.name) &&
                  (i.paymentAllocationPlan?.name == this.ruleEngineCriterionCard.paymentAllocationPlan?.name))
              })
              this.NotRECHide = true;
              this.SettingRECFalse();
              this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC].isEntered = true;
              this.ruleEngineCriterionCard = this.ruleEngineListResponse[this.indexRE].ruleEnginePlanDerivationCriterionList[this.indexREC];
            } else { this.NotRECHide = false; }
          }
          else { this.NotREHide = false; }

        },
          err => {
            if (err?.error?.errorCode) {
              this.errorCode = err.error.errorCode;
            }
            else {
              this.errorCode = "InternalServiceFault"
            }
            this.spinnerService.setIsLoading(false);
            this.deletedRecords = [...new Array<ruleEnginePlanDerivationConfig>()];
            this.exceptionBox = true;
          })

      },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<ruleEnginePlanDerivationConfig>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.setExternalErrorTrue();
    }
  }

  setExternalErrorFalse() {
    this.NameTextBoxconfig.externalError = false
    this.OutputTextBoxconfig.externalError = false
  
  }

  setExternalErrorTrue() {
    this.NameTextBoxconfig.externalError = true
    this.OutputTextBoxconfig.externalError = true
   
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage

      })
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
      }
    }
    else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {

      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);

      }

    })

  }

  buildConfiguration() {

    const NameRequired = new ErrorDto;
    NameRequired.validation = "required";
    NameRequired.isModelError = true;
    NameRequired.validationMessage = this.translate.instant('plan.ruleEngine.mandatory.RuleModelName') + this.translate.instant('plan.ruleEngine.mandatory.required');
    this.NameTextBoxconfig.Errors = [NameRequired];
    this.NameTextBoxconfig.required = true

    const OutputRequired = new ErrorDto;
    OutputRequired.validation = "required";
    OutputRequired.isModelError = true;
    OutputRequired.validationMessage = this.translate.instant('plan.ruleEngine.mandatory.Output') + this.translate.instant('plan.ruleEngine.mandatory.required');
    this.OutputTextBoxconfig.Errors = [OutputRequired];
    this.OutputTextBoxconfig.required = true

   
  }

}
