import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { FormControlStatus } from '@angular/forms';
import {
  DIPService,
  FMAService,
  IllustrationService,
  Journey,
  LoanProgressRequest,
  LoanProgressResponse,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // constants
  readonly DEBOUNCE_TIME = 10000;
  readonly LOW_DEBOUNCE_TIME = 1500;

  // public behaviorSubjects
  public formStatus$ = new BehaviorSubject<Record<string, FormControlStatus>>({});
  public navigatedToPanel$ = new BehaviorSubject(false);

  // data objects
  private formData: any;
  private stepStatus: Record<string, FormControlStatus> = {
    repaymentStrategy: 'VALID',
    previousEmployment: 'VALID',
  };

  private _journeyProgress$ = new BehaviorSubject<Record<string, string>>({});
  private _stepHasUnsavedChanges$ = new BehaviorSubject(false);

  set journeyProgress(value: Record<string, string> | null | undefined) {
    if (!value) return;
    this._journeyProgress$.next(value);
  }

  get journeyProgress() {
    return this._journeyProgress$.getValue();
  }

  set stepHasUnsavedChanges(value: boolean) {
    this._stepHasUnsavedChanges$.next(value);
  }

  get stepHasUnsavedChanges() {
    return this._stepHasUnsavedChanges$.getValue();
  }

  stepHasUnsavedChanges$ = this._stepHasUnsavedChanges$.asObservable();

  constructor(
    private translateService: TranslateService,
    private toastService: ToastService,
    private dipService: DIPService,
    private illustrationService: IllustrationService,
    private fmaService: FMAService,
  ) {}

  private _activeJourney = new BehaviorSubject<boolean>(false);

  public activeJourney$ = this._activeJourney.asObservable();

  public get activeJourney(): boolean {
    return this._activeJourney.getValue();
  }

  public set activeJourney(val: boolean) {
    this._activeJourney.next(val);
  }

  /**
   * @deprecated
   * Use setFormStatus as we shouldn't store data (in the FE) anymore. Remove when unused
   */
  public setFormData(stepData: any, caseForm: FormControlStatus, key: string) {
    this.formData[key] = stepData;
    this.stepStatus[key] = caseForm;
    this.formStatus$.next(this.stepStatus);
  }

  // TODO remove this method from all the steps in the journey ( ill - dip - fma ) and replace it with the one below ( setStepStatus )
  public setFormStatus(caseForm: FormControlStatus, key: string, emitValue: boolean = true) {
    this.stepStatus[key] = caseForm;
    if (emitValue) {
      this.formStatus$.next(this.stepStatus);
    }
  }

  // TODO use this method in all the steps in the journey ( ill - dip - fma )
  public setStepStatus(stepStatus: StepStatusEnum | null, key: string, emitValue: boolean = true) {
    if (!stepStatus) return;
    this.stepStatus[key] = stepStatus;
    if (emitValue) {
      this.formStatus$.next(this.stepStatus);
    }
  }

  public getFormData(key: string) {
    if (!this.formData) {
      this.formData = {};
    }
    return this.formData && this.formData[key];
  }

  public reset() {
    this.formData = {};
    this.stepStatus = {};
    this.formStatus$.next({});
    this.stepHasUnsavedChanges = false;
  }

  public saveProgress(
    journey: Journey,
    appId: number,
    loanId: number,
    data: Record<string, FormControlStatus | StepStatusEnum>,
    getDataCb: Observable<any> = of(null),
  ): Observable<any> {
    const dataKey: string = Object.keys(data)[0];
    const objectLength = Object.keys(data).length;
    const getProgress: Record<string, Observable<LoanProgressResponse>> = {
      ILLUSTRATION: this.illustrationService.illustrationGetLoanProgress(appId, loanId),
      DIP: this.dipService.dIPGetLoanProgress(appId, loanId),
      FMA: this.illustrationService.illustrationGetLoanProgress(appId, loanId),
    };

    const putProgress: Record<string, (body: LoanProgressRequest) => Observable<unknown>> = {
      ILLUSTRATION: body => this.illustrationService.illustrationPutLoanProgress(appId, loanId, body),
      DIP: body => this.dipService.dIPPutLoanProgress(appId, loanId, body),
      FMA: body => this.fmaService.fMAPutLoanProgress(appId, loanId, body),
    };

    if (this.journeyProgress && this.journeyProgress[dataKey] === data[dataKey] && objectLength === 1) {
      return getDataCb;
    } else {
      return getProgress[journey].pipe(
        concatMap(res => {
          this.journeyProgress = {
            ...res.progress,
            ...data,
          };
          return putProgress[journey]({
            versionNumber: res.versionNumber as number,
            progress: data,
          }).pipe(concatMap(() => getDataCb));
        }),
      );
    }
  }
}
