import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { RoutePaths } from '../constants';
import {
  CasePurposeType,
  Journey,
  KeyValuePairOfStringAndString,
  ProductService,
  PropertyPurpose,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';
import { FormArray, FormControlStatus, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StepSetupService {
  routePaths: typeof RoutePaths = RoutePaths;

  private _currentJourney$ = new BehaviorSubject<MenuItem[]>([]);
  private _currentStep$ = new BehaviorSubject<string>('');

  set currentJourney(value: MenuItem[]) {
    this._currentJourney$.next(value);
  }

  get currentJourney() {
    return this._currentJourney$.getValue();
  }

  public currentJourney$ = this._currentJourney$.asObservable();

  set currentStep(value: string) {
    this._currentStep$.next(value);
  }

  get currentStep() {
    return this._currentStep$.getValue();
  }

  public currentStep$ = this._currentStep$.asObservable();

  casePurposeType = '';
  propertyPurpose = '';
  isRemortgage = false;

  dipEntryPoint = {
    routerLink: `./${this.routePaths.CREATE_DIP}`,
    styleClass: 'd-none',
    automationId: 'dipEntrypoint',
    visible: false,
  };
  propertyLoan = {
    label: this.translate.instant('createDip.steps.propertyAndLoan'),
    routerLink: `./${this.routePaths.CREATE_DIP_PROPERTY_AND_LOAN}`,
    styleClass: 'incomplete',
    automationId: 'propertyAndLoan',
    visible: true,
    state: {
      dirty: false,
    },
  };

  illustrationEntryPoint = {
    routerLink: `./${this.routePaths.CREATE_ILLUSTRATION}`,
    styleClass: 'd-none',
    automationId: 'illustrationEntryPoint',
    visible: false,
  };
  loanDetails = {
    label: this.translate.instant('createIllustration.steps.loanDetails'),
    routerLink: `./${this.routePaths.CREATE_ILLUSTRATION_LOAN_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'loanDetails',
    visible: true,
  };
  confirm = {
    label: this.translate.instant('createIllustration.steps.confirm'),
    routerLink: `./${this.routePaths.CREATE_ILLUSTRATION_CONFIRM}`,
    styleClass: 'incomplete',
    automationId: 'confirm',
    visible: true,
  };
  securityProperty = {
    label: this.translate.instant('createDip.steps.securityProperty'),
    routerLink: `./${this.routePaths.CREATE_DIP_SECURITY_PROPERTY}`,
    styleClass: 'incomplete',
    automationId: 'securityProperty',
    visible: true,
    state: {
      dirty: false,
    },
  };
  buyToLetPropertyDetails = {
    label: this.translate.instant('createDip.steps.buyToLetPropertyDetails'),
    routerLink: `./${this.routePaths.CREATE_DIP_BUY_TO_LET_PROPERTY_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'btlPropertyDetails',
    visible: true,
    state: {
      dirty: false,
    },
  };
  buyToLetPortfolio = {
    label: this.translate.instant('createDip.steps.buyToLetPortfolio'),
    routerLink: `./${this.routePaths.CREATE_DIP_BUY_TO_LET_PORTFOLIO}`,
    styleClass: 'incomplete',
    automationId: 'btlPortfolio',
    visible: true,
    state: {
      dirty: false,
    },
  };
  buyToLetSPV = {
    label: this.translate.instant('createDip.steps.buyToLetSPV'),
    routerLink: `./${this.routePaths.CREATE_DIP_BUY_TO_LET_SPV}`,
    styleClass: 'incomplete',
    automationId: 'btlSPV',
    visible: true,
    state: {
      dirty: false,
    },
  };
  existingMortgages = {
    label: this.translate.instant('createDip.steps.existingMortgages'),
    routerLink: `./${this.routePaths.CREATE_DIP_EXISTING_MORTGAGES}`,
    styleClass: 'incomplete',
    automationId: 'existingMortgages',
    visible: true,
    state: {
      dirty: false,
    },
  };
  additionalBorrowing = {
    label: this.translate.instant('createDip.steps.additionalBorrowing'),
    routerLink: `./${this.routePaths.CREATE_DIP_ADDITIONAL_BORROWING}`,
    styleClass: 'incomplete',
    automationId: 'additionalBorrowing',
    visible: true,
    state: {
      dirty: false,
    },
  };
  deposit = {
    label: this.translate.instant('createDip.steps.depositDetails'),
    routerLink: `./${this.routePaths.CREATE_DIP_DEPOSIT_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'depositDetails',
    visible: true,
    state: {
      dirty: false,
    },
  };
  productSelection = {
    label: this.translate.instant('createDip.steps.productSelection'),
    routerLink: `./${this.routePaths.CREATE_DIP_PRODUCT_SELECTION}`,
    styleClass: 'incomplete',
    automationId: 'productSelection',
    visible: true,
    state: {
      dirty: false,
    },
  };
  adviceFees = {
    label: this.translate.instant('createDip.steps.adviceAndFees'),
    routerLink: `./${this.routePaths.CREATE_DIP_ADVICE_FEES}`,
    styleClass: 'incomplete',
    automationId: 'adviceFees',
    visible: true,
    state: {
      dirty: false,
    },
  };
  personalDetail = {
    label: this.translate.instant('createDip.steps.personalDetails'),
    routerLink: `./${this.routePaths.CREATE_DIP_PERSONAL_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'personalDetails',
    visible: true,
    state: {
      dirty: false,
    },
  };
  addressHistory = {
    label: this.translate.instant('createDip.steps.addressHistory'),
    routerLink: `./${this.routePaths.CREATE_DIP_ADDRESS_HISTORY}`,
    styleClass: 'incomplete',
    automationId: 'addressHistory',
    visible: true,
    state: {
      dirty: false,
    },
  };
  repaymentStrategy = {
    label: this.translate.instant('createDip.steps.repaymentStrategy'),
    routerLink: `./${this.routePaths.CREATE_DIP_REPAYMENT_STRATEGY}`,
    styleClass: 'd-none',
    automationId: 'repaymentStrategy',
    visible: false,
    state: {
      dirty: false,
    },
  };
  financialCommitments = {
    label: this.translate.instant('createDip.steps.financialCommitments'),
    routerLink: `./${this.routePaths.CREATE_DIP_FINANCIAL_COMMITMENTS}`,
    styleClass: 'incomplete',
    automationId: 'financialCommitments',
    visible: true,
    state: {
      dirty: false,
    },
  };
  householdExpenditure = {
    label: this.translate.instant('createDip.steps.householdExpenditure'),
    routerLink: `./${this.routePaths.CREATE_DIP_HOUSEHOLD_EXPENDITURE}`,
    styleClass: 'incomplete',
    automationId: 'householdExpenditure',
    visible: true,
    state: {
      dirty: false,
    },
  };
  currentIncome = {
    label: this.translate.instant('createDip.titles.currentIncome'),
    routerLink: `./${this.routePaths.CREATE_DIP_CURRENT_INCOME}`,
    styleClass: 'incomplete',
    automationId: 'currentIncome',
    visible: true,
    state: {
      dirty: false,
    },
  };
  previousEmployment = {
    label: this.translate.instant('createDip.steps.previousEmployment'),
    routerLink: `./${this.routePaths.CREATE_DIP_PREVIOUS_EMPLOYMENT}`,
    styleClass: 'incomplete',
    automationId: 'previousEmployment',
    visible: true,
    state: {
      dirty: false,
    },
  };
  futureChanges = {
    label: this.translate.instant('createDip.steps.futureChanges'),
    routerLink: `./${this.routePaths.CREATE_DIP_FUTURE_CHANGES}`,
    styleClass: 'incomplete',
    automationId: 'futureChanges',
    visible: true,
    state: {
      dirty: false,
    },
  };
  retirementIncome = {
    label: this.translate.instant('createDip.steps.retirementIncome'),
    routerLink: `./${this.routePaths.CREATE_DIP_RETIREMENT_INCOME}`,
    styleClass: 'incomplete',
    automationId: 'retirementIncome',
    visible: true,
    state: {
      dirty: false,
    },
  };
  confirmDip = {
    label: this.translate.instant('createDip.steps.dip'),
    routerLink: `./${this.routePaths.CONFIRM_DIP}`,
    styleClass: 'incomplete',
    automationId: 'submit',
    disabled: true,
    visible: true,
  };

  fmaEntryPoint = {
    routerLink: `./${this.routePaths.CREATE_FMA}`,
    styleClass: 'd-none',
    automationId: 'fmaEntrypoint',
    visible: false,
  };
  contactDetails = {
    label: this.translate.instant('createFma.steps.contactDetails'),
    routerLink: `./${this.routePaths.CREATE_FMA_CONTACT_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'contactDetails',
    visible: true,
  };
  fmaCurrentIncome = {
    label: this.translate.instant('createFma.steps.currentIncome'),
    routerLink: `./${this.routePaths.CREATE_FMA_CURRENT_INCOME}`,
    styleClass: 'incomplete',
    automationId: 'fmaCurrentIncome',
    visible: true,
  };
  fmaSecurityProperty = {
    label: this.translate.instant('createFma.steps.securityProperty'),
    routerLink: `./${this.routePaths.CREATE_FMA_SECURITY_PROPERTY}`,
    styleClass: 'incomplete',
    automationId: 'fmaSecurityProperty',
    visible: true,
  };
  affordabilityCheck = {
    label: this.translate.instant('createFma.steps.affordabilityCheck'),
    routerLink: `./${this.routePaths.CREATE_FMA_AFFORDABILITY_CHECK}`,
    styleClass: 'incomplete',
    automationId: 'affordabilityCheck',
    visible: true,
  };
  solicitorDetails = {
    label: this.translate.instant('createFma.steps.solicitorDetails'),
    routerLink: `./${this.routePaths.CREATE_FMA_SOLICITOR_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'solicitorDetails',
    visible: true,
  };
  valuationDetails = {
    label: this.translate.instant('createFma.steps.valuationDetails'),
    routerLink: `./${this.routePaths.CREATE_FMA_VALUATION_DETAILS}`,
    styleClass: 'incomplete',
    automationId: 'valuationDetails',
    visible: true,
  };
  bankAccount = {
    label: this.translate.instant('createFma.steps.bankAccount'),
    routerLink: `./${this.routePaths.CREATE_FMA_BANK_ACCOUNT}`,
    styleClass: 'incomplete',
    automationId: 'bankAccount',
    visible: true,
  };
  lenderPolicyCheck = {
    label: this.translate.instant('createFma.steps.lendingPolicyCheck'),
    routerLink: `./${this.routePaths.CREATE_FMA_LENDER_POLICY_CHECK}`,
    styleClass: 'incomplete',
    automationId: 'lenderPolicyCheck',
    visible: true,
  };
  uploadStipulations = {
    label: this.translate.instant('createFma.steps.uploadStipulations'),
    routerLink: `./${this.routePaths.CREATE_FMA_UPLOAD_STIPULATIONS}`,
    styleClass: 'incomplete',
    automationId: 'uploadStipulations',
    visible: true,
  };
  feePayment = {
    label: this.translate.instant('createFma.steps.feePayment'),
    routerLink: `./${this.routePaths.CREATE_FMA_FEE_PAYMENT}`,
    styleClass: 'incomplete',
    automationId: 'feePayment',
    visible: true,
  };
  confirmFma = {
    label: this.translate.instant('createFma.steps.confirmFma'),
    routerLink: `./${this.routePaths.CREATE_FMA_CONFIRM_FMA}`,
    styleClass: 'incomplete',
    automationId: 'confirmFma',
    visible: true,
  };

  illustrationJourney = [
    { ...this.illustrationEntryPoint },
    { ...this.loanDetails },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.confirm },
  ];

  purchaseOwnerOccupationJourney = [
    { ...this.dipEntryPoint },
    { ...this.propertyLoan },
    { ...this.securityProperty },
    { ...this.deposit },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.personalDetail },
    { ...this.addressHistory },
    { ...this.repaymentStrategy },
    { ...this.financialCommitments },
    { ...this.householdExpenditure },
    { ...this.currentIncome },
    { ...this.previousEmployment },
    { ...this.futureChanges },
    { ...this.retirementIncome },
    { ...this.confirmDip },
  ];

  remortgageOwnerOccupationJourney = [
    { ...this.dipEntryPoint },
    { ...this.propertyLoan },
    { ...this.securityProperty },
    { ...this.existingMortgages },
    { ...this.additionalBorrowing },
    { ...this.deposit },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.personalDetail },
    { ...this.addressHistory },
    { ...this.repaymentStrategy },
    { ...this.financialCommitments },
    { ...this.householdExpenditure },
    { ...this.currentIncome },
    { ...this.previousEmployment },
    { ...this.futureChanges },
    { ...this.retirementIncome },
    { ...this.confirmDip },
  ];

  purchaseBuyToLetJourney = [
    { ...this.dipEntryPoint },
    { ...this.securityProperty },
    { ...this.buyToLetPropertyDetails },
    { ...this.buyToLetPortfolio },
    { ...this.buyToLetSPV },
    { ...this.deposit },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.personalDetail },
    { ...this.addressHistory },
    { ...this.repaymentStrategy },
    { ...this.financialCommitments },
    { ...this.householdExpenditure },
    { ...this.currentIncome },
    { ...this.previousEmployment },
    { ...this.futureChanges },
    { ...this.retirementIncome },
    { ...this.confirmDip },
  ];

  remortgageBuyToLetJourney = [
    { ...this.dipEntryPoint },
    { ...this.propertyLoan },
    { ...this.securityProperty },
    { ...this.buyToLetPropertyDetails },
    { ...this.buyToLetPortfolio },
    { ...this.buyToLetSPV },
    { ...this.existingMortgages },
    { ...this.additionalBorrowing },
    { ...this.deposit },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.personalDetail },
    { ...this.addressHistory },
    { ...this.repaymentStrategy },
    { ...this.financialCommitments },
    { ...this.householdExpenditure },
    { ...this.currentIncome },
    { ...this.previousEmployment },
    { ...this.futureChanges },
    { ...this.retirementIncome },
    { ...this.confirmDip },
  ];

  fmaJourney: MenuItem[] = [
    { ...this.fmaEntryPoint },
    { ...this.contactDetails },
    { ...this.fmaCurrentIncome },
    { ...this.retirementIncome },
    { ...this.fmaSecurityProperty },
    { ...this.productSelection },
    { ...this.adviceFees },
    { ...this.affordabilityCheck },
    { ...this.solicitorDetails },
    { ...this.valuationDetails },
    { ...this.bankAccount },
    { ...this.lenderPolicyCheck },
    { ...this.uploadStipulations },
    { ...this.feePayment },
    { ...this.confirmFma },
  ];

  constructor(private translate: TranslateService, private dataService: DataService, private productService: ProductService) {}

  setCurrentStep(stepId: string) {
    this.currentStep = stepId;
  }

  getCurrentStep() {
    return this.currentStep;
  }

  navigateBack(): string {
    const index = this.currentJourney.findIndex(item => item.automationId === this.currentStep);
    const arr = this.currentJourney.slice(0, index).reverse();
    const prevEnabledStep = arr.find(item => !item.disabled && item.visible);

    if (prevEnabledStep) {
      return prevEnabledStep.routerLink;
    }
    return '../';
  }

  navigateForward(): string {
    const index = this.currentJourney.findIndex(item => item.automationId === this.currentStep);
    const arr = this.currentJourney.slice(index + 1, this.currentJourney.length);
    const nextEnabledStep = arr.find(item => !item.disabled && item.visible);

    if (nextEnabledStep) {
      return nextEnabledStep.routerLink;
    }
    return '../';
  }

  isNextButtonEnabled() {
    const index = this.currentJourney.findIndex(item => item.automationId === this.currentStep);
    const arr = this.currentJourney.slice(index + 1, this.currentJourney.length);
    return arr.find(item => !item.disabled && item.visible);
  }

  getFmaJourney(): MenuItem[] {
    this.currentJourney = this.fmaJourney;
    return this.currentJourney;
  }

  getIllustrationJourney(): MenuItem[] {
    this.currentJourney = this.illustrationJourney;
    return this.currentJourney;
  }

  getJourneyByCaseTypes(data: Data | undefined): MenuItem[] {
    const propertyPurpose = data?.summary.caseData?.customData.find(
      (item: KeyValuePairOfStringAndString) => item.key === 'PropertyPurpose',
    ).value;
    this.casePurposeType = data?.summary.caseData.casePurposeType;
    this.propertyPurpose = propertyPurpose;

    if (data?.summary.caseData.casePurposeType === CasePurposeType.Purchase) {
      this.isRemortgage = false;
      if (propertyPurpose === PropertyPurpose.OWNER_OCCUPATION) {
        this.currentJourney = this.purchaseOwnerOccupationJourney;
      } else if (propertyPurpose === PropertyPurpose.BUY_TO_LET) {
        this.currentJourney = this.purchaseBuyToLetJourney;
      }
    } else if (data?.summary.caseData.casePurposeType === CasePurposeType.Remortgage) {
      this.isRemortgage = true;
      if (propertyPurpose === PropertyPurpose.OWNER_OCCUPATION) {
        this.currentJourney = this.remortgageOwnerOccupationJourney;
      } else if (propertyPurpose === PropertyPurpose.BUY_TO_LET) {
        this.currentJourney = this.remortgageBuyToLetJourney;
      }
    }

    return this.currentJourney;
  }

  isStepAuthorized(urlName: string): boolean {
    return !!this.currentJourney.find(
      (item, index) =>
        (item.routerLink.includes(urlName) && !item.disabled && item.visible) ||
        (item.routerLink.includes(urlName) && !item.visible && index === 0),
    );
  }

  removeStepFromJourney(stepId: string) {
    const stepIndex = this.currentJourney.findIndex(item => item.automationId === stepId);
    if (stepIndex !== -1) {
      this.currentJourney.splice(stepIndex, 1);
    }
  }

  addStepToJourney(stepIndex: number, step: MenuItem) {
    const isStepHidden = this.currentJourney.findIndex(item => item.automationId === step.automationId) === -1;
    if (isStepHidden) {
      this.currentJourney.splice(stepIndex, 0, step);
    }
  }

  invalidateStep(automationId: string) {
    const index = this.currentJourney.findIndex(item => item.automationId === automationId);
    if (index !== -1) {
      const deepCopy = JSON.parse(JSON.stringify(this.currentJourney));
      deepCopy[index].styleClass = 'incomplete';

      this.currentJourney = deepCopy;

      this.dataService.setFormStatus('INVALID', deepCopy[index].automationId, false);
    }
  }

  setDisabledStepStatus(automationId: string, disabled: boolean) {
    const index = this.currentJourney.findIndex(item => item.automationId === automationId);
    if (index !== -1) {
      const deepCopy = JSON.parse(JSON.stringify(this.currentJourney));
      deepCopy[index] = {
        ...deepCopy[index],
        styleClass: disabled ? 'incomplete' : deepCopy[index].styleClass,
        disabled,
      };
      if (disabled) {
        this.dataService.setFormStatus('INVALID', deepCopy[index].automationId, false);
      }
      this.currentJourney = deepCopy;
    }
  }

  setDisabledSteps(automationIds: string[], disabled: boolean) {
    automationIds.forEach(item => {
      this.setDisabledStepStatus(item, disabled);
    });
  }

  validateJourney(status: { [key: string]: string }): Observable<MenuItem[]> {
    // check if current step form is valid and if so update step css class
    const cloneJourney = JSON.parse(JSON.stringify(this.currentJourney));
    this.currentJourney = cloneJourney.map((el: MenuItem) => {
      if (el.visible) {
        return {
          ...el,
          styleClass:
            status[el.automationId] === 'VALID' ||
            (!status[el.automationId] && this.dataService.journeyProgress?.[el.automationId] === 'VALID')
              ? 'complete'
              : 'incomplete',
          state: {
            dirty: !!this.dataService.journeyProgress?.[el.automationId],
          },
        };
      }
      return el;
    });
    return this.currentJourney$;
  }

  checkConfirmStep(journey: Journey) {
    let entryPoint: MenuItem;
    let confirm: MenuItem;

    if (journey === Journey.Illustration) {
      entryPoint = this.illustrationEntryPoint;
      confirm = this.confirm;
    } else if (journey === Journey.Dip) {
      entryPoint = this.dipEntryPoint;
      confirm = this.confirmDip;
    } else {
      entryPoint = this.fmaEntryPoint;
      confirm = this.confirmFma;
    }

    const allButConfirm = this.currentJourney.filter(
      (stepObj: MenuItem) =>
        stepObj.automationId !== entryPoint.automationId &&
        stepObj.automationId !== confirm.automationId &&
        stepObj.automationId !== this.repaymentStrategy.automationId,
    );

    if (journey === Journey.Fma) {
      const affordabilityIndex = allButConfirm.findIndex(step => step.automationId === this.affordabilityCheck.automationId);
      const lendingPolicyIndex = allButConfirm.findIndex(step => step.automationId === this.lenderPolicyCheck.automationId);
      const initialSteps = allButConfirm.slice(0, affordabilityIndex);
      const lendingPolicySteps = allButConfirm.slice(0, lendingPolicyIndex);
      const lendingPolicyCheckIsValid = this.stepIsValid(this.lenderPolicyCheck);
      const initialStepsValidAmount = initialSteps.filter((step: MenuItem) => step.styleClass === 'complete').length;
      const lendingPolicyStepsValidAmount = lendingPolicySteps.filter((step: MenuItem) => step.styleClass === 'complete').length;

      if (lendingPolicyStepsValidAmount < lendingPolicySteps.length) {
        this.setDisabledStepStatus(this.lenderPolicyCheck.automationId, true);
        this.setDisabledStepStatus(this.uploadStipulations.automationId, true);
        this.setDisabledStepStatus(this.feePayment.automationId, true);
      }

      if (lendingPolicyStepsValidAmount === lendingPolicySteps.length && lendingPolicyCheckIsValid) {
        this.setDisabledStepStatus(this.uploadStipulations.automationId, false);
        this.setDisabledStepStatus(this.feePayment.automationId, false);
      }

      if (lendingPolicyStepsValidAmount === lendingPolicySteps.length && !lendingPolicyCheckIsValid) {
        this.setDisabledStepStatus(this.lenderPolicyCheck.automationId, false);
        this.setDisabledStepStatus(this.uploadStipulations.automationId, true);
        this.setDisabledStepStatus(this.feePayment.automationId, true);
      }

      if (initialStepsValidAmount < initialSteps.length) {
        this.setDisabledStepStatus(this.affordabilityCheck.automationId, true);
      }

      if (initialStepsValidAmount === initialSteps.length) {
        this.setDisabledStepStatus(this.affordabilityCheck.automationId, false);
      }

      if (lendingPolicyStepsValidAmount > lendingPolicySteps.length) {
        this.setDisabledStepStatus(this.uploadStipulations.automationId, false);
        this.setDisabledStepStatus(this.feePayment.automationId, false);
      }
    }

    const amountValid = allButConfirm.filter((step: MenuItem) => step.styleClass === 'complete').length;
    const stepNumber = allButConfirm.length;
    const areAllValid = amountValid === stepNumber;
    this.setDisabledStepStatus(confirm.automationId, !areAllValid);
  }

  highlightMissingFields(stepName: string, form: FormGroup | FormArray): void {
    const currentStep = this.currentJourney.find(el => el.automationId === stepName);
    if (currentStep?.state?.dirty) {
      form.markAllAsTouched();
    }
  }

  // Fn to validate the affordabilityCheck + lenderPolicy or only lenderPolicy and handle invalidations
  validateFmaChecks(onlyLenderPolicy?: boolean): Record<string, FormControlStatus> {
    let progressDataObject: Record<string, FormControlStatus> = {};

    const completedSteps = this.currentJourney.reduce((acm: { [key: string]: boolean }, currentValue) => {
      if (currentValue.styleClass === 'complete') {
        acm[currentValue.automationId] = true;
      }
      return acm;
    }, {});

    if (completedSteps[this.affordabilityCheck.automationId] || this.dataService.journeyProgress?.[this.affordabilityCheck.automationId]) {
      if (!onlyLenderPolicy) {
        this.invalidateStep(this.affordabilityCheck.automationId);
        progressDataObject = {
          [this.affordabilityCheck.automationId]: 'INVALID',
        };
      }

      if (completedSteps[this.lenderPolicyCheck.automationId] || this.dataService.journeyProgress?.[this.lenderPolicyCheck.automationId]) {
        progressDataObject = {
          ...progressDataObject,
          ...((completedSteps[this.lenderPolicyCheck.automationId] ||
            this.dataService.journeyProgress?.[this.lenderPolicyCheck.automationId]) && {
            [this.lenderPolicyCheck.automationId]: 'INVALID',
          }),
          ...((completedSteps[this.uploadStipulations.automationId] ||
            this.dataService.journeyProgress?.[this.uploadStipulations.automationId]) && {
            [this.uploadStipulations.automationId]: 'INVALID',
          }),
          ...((completedSteps[this.feePayment.automationId] || this.dataService.journeyProgress?.[this.feePayment.automationId]) && {
            [this.feePayment.automationId]: 'INVALID',
          }),
          ...((completedSteps[this.confirmFma.automationId] || this.dataService.journeyProgress?.[this.confirmFma.automationId]) && {
            [this.confirmFma.automationId]: 'INVALID',
          }),
        };
      }
    }

    return progressDataObject;
  }

  stepIsValid(step: MenuItem): boolean {
    return this.currentJourney.findIndex(el => el.automationId === step.automationId && el.styleClass === 'complete') !== -1;
    // TODO we should use journeyProgress but if local progress it is already updated but in backend not yet because it has not been saved yet, the check will return incomplete when is completed. So we need a refactor
    // return this.dataService.journeyProgress?.[step.automationId] === StepStatusEnum.VALID;
  }

  checkActiveJourney(stepName: string, form?: FormGroup | FormArray): Observable<boolean> {
    return this.dataService.activeJourney$.pipe(
      distinctUntilChanged(),
      map(val => {
        if (form) {
          if (val) {
            this.dataService.setFormStatus(form.status, stepName);
            if (form.disabled) {
              form.enable({ emitEvent: false });
            }
            this.highlightMissingFields(stepName, form);
          } else {
            form.disable({ emitEvent: false });
          }
        }
        return val;
      }),
    );
  }
}
