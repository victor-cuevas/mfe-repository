import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { finalize, map, switchMap, take } from 'rxjs/operators';
import {
  CaseDataResponse,
  CaseService,
  CaseStage,
  CaseStatusEnum,
  CreateDIPResponse,
  DIPService,
  DipSummaryResponse,
  DraftStage,
  DraftStatus,
  FirmDetailsModel,
  FMASummaryResponse,
  IllustrationService,
  IllustrationSummaryResponse,
  LoanProductAvailabilityResponse,
  LoanStage,
  LoanStatus,
  PortalPermissionType,
  ProductAvailabilityResponse,
  ProductService,
  RejectionReasonResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SeveritiesEnum, ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { StepSetupService } from './step-setup.service';
import { CheckPermissionsService } from './check-permissions.service';
import { DataService } from './data.service';

interface SecondaryCalls {
  [CaseStage.Illustration]: boolean;
  [CaseStage.Dip]: boolean;
  [CaseStage.Fma]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CaseSummaryService {
  constructor(
    private caseService: CaseService,
    private spinnerService: SpinnerService,
    private dipService: DIPService,
    private illustrationService: IllustrationService,
    private toastService: ToastService,
    private productService: ProductService,
    private stepSetupService: StepSetupService,
    private checkPermissionsService: CheckPermissionsService,
    private dataService: DataService,
  ) {}

  private _fimData: FirmDetailsModel | null | undefined = undefined;
  private _illustrationSummary = new BehaviorSubject<IllustrationSummaryResponse | null | undefined>(undefined);
  private _dipSummary = new BehaviorSubject<DipSummaryResponse | null | undefined>(undefined);
  private _fmaSummary = new BehaviorSubject<FMASummaryResponse | null | undefined>(undefined);
  private _caseStage = new BehaviorSubject<string | null | undefined>(undefined);
  private _caseStatus = new BehaviorSubject<string | null | undefined>(undefined);
  private _draftStage = new BehaviorSubject<string | null | undefined>(DraftStage.Undefined);
  private _draftStatus = new BehaviorSubject<string | null | undefined>(DraftStatus.Undefined);
  private _loanStage = new BehaviorSubject<string | null | undefined>(LoanStage.Undefined);
  private _loanStatus = new BehaviorSubject<string | null | undefined>(LoanStatus.Undefined);
  private _rejectionReasons = new BehaviorSubject<RejectionReasonResponse[]>([] as RejectionReasonResponse[]);
  private _dipExpirationDate = new BehaviorSubject<string | null | undefined>(LoanStatus.Undefined);
  private _isLoadingDip = new BehaviorSubject<boolean>(false);
  private _invalidLoanPartsProduct$ = new BehaviorSubject<number[] | null | undefined>([]); // null = error & undefined = loading

  public illustrationSummary$ = this._illustrationSummary.asObservable();
  public dipSummary$ = this._dipSummary.asObservable();
  public fmaSummary$ = this._fmaSummary.asObservable();
  public caseStage$ = this._caseStage.asObservable();
  public caseStatus$ = this._caseStatus.asObservable();
  public draftStage$ = this._draftStage.asObservable();
  public draftStatus$ = this._draftStatus.asObservable();
  public loanStage$ = this._loanStage.asObservable();
  public loanStatus$ = this._loanStatus.asObservable();
  public rejectionReasons$ = this._rejectionReasons.asObservable();
  public dipExpirationDate$ = this._dipExpirationDate.asObservable();
  public isLoadingDip$ = this._isLoadingDip.asObservable();
  public invalidLoanPartsProduct$ = this._invalidLoanPartsProduct$.asObservable();

  // FIRM TODO move to another service/store
  set fimData(value: FirmDetailsModel | null | undefined) {
    if (!value) return;
    this._fimData = value;
  }

  get fimData() {
    return this._fimData;
  }

  // CASE
  set caseStage(value: string | null | undefined) {
    if (!value) return;
    this._caseStage.next(value);
  }

  get caseStage() {
    return this._caseStage.getValue();
  }

  set caseStatus(value: string | null | undefined) {
    if (!value) return;
    this._caseStatus.next(value);
  }

  get caseStatus() {
    return this._caseStatus.getValue();
  }

  // APPLICATION DRAFT
  set draftStage(value: string | null | undefined) {
    if (!value) return;
    this._draftStage.next(value);
  }

  get draftStage() {
    return this._draftStage.getValue();
  }

  set draftStatus(value: string | null | undefined) {
    if (!value) return;
    this._draftStatus.next(value);
  }

  get draftStatus() {
    return this._draftStatus.getValue();
  }

  // LOAN
  set loanStatus(value: string | null | undefined) {
    if (!value) return;
    this._loanStatus.next(value);
  }

  get loanStatus() {
    return this._loanStatus.getValue();
  }

  set loanStage(value: string | null | undefined) {
    if (!value) return;
    this._loanStage.next(value);
  }

  get loanStage() {
    return this._loanStage.getValue();
  }

  set rejectionReasons(value: RejectionReasonResponse[] | undefined) {
    if (!value) return;
    this._rejectionReasons.next(value as RejectionReasonResponse[]);
  }

  get rejectionReasons() {
    return this._rejectionReasons.getValue();
  }

  // ILLUSTRATION
  set illustrationSummary(value: IllustrationSummaryResponse | null | undefined) {
    if (value === undefined) return;
    this._illustrationSummary.next(value);
  }

  get illustrationSummary() {
    return this._illustrationSummary.getValue();
  }

  // DIP
  set dipSummary(value: DipSummaryResponse | null | undefined) {
    if (value === undefined) return;
    this._dipSummary.next(value);
  }

  get dipSummary(): DipSummaryResponse | null | undefined {
    return this._dipSummary.getValue();
  }

  set dipExpirationDate(value: string | null | undefined) {
    if (!value) return;
    this._dipExpirationDate.next(value);
  }

  get dipExpirationDate() {
    return this._dipExpirationDate.getValue();
  }

  set isLoadingDip(value: boolean) {
    this._isLoadingDip.next(value);
  }

  // FMA SUMMARY
  set fmaSummary(value: FMASummaryResponse | null | undefined) {
    if (value === undefined) return;
    this._fmaSummary.next(value);
  }

  get fmaSummary(): FMASummaryResponse | null | undefined {
    return this._fmaSummary.getValue();
  }

  // PRODUCT AVAILABILITY
  set invalidLoanPartsProduct(value: number[] | null | undefined) {
    this._invalidLoanPartsProduct$.next(value);
  }

  get invalidLoanPartsProduct(): number[] | null | undefined {
    return this._invalidLoanPartsProduct$.getValue();
  }

  public createDip(dipData: CreateDIPResponse) {
    this.dipSummary = { applicationDraftId: dipData.applicationDraftId, loan: { loanId: dipData.loanId } };
    this.caseStage = CaseStage.Dip;
    this.caseStatus = CaseStatusEnum.InProgress;
    this.draftStage = DraftStage.Dip;
    this.draftStatus = DraftStatus.InProgress;
    this.loanStage = LoanStage.Dip;
    this.loanStatus = LoanStatus.InProgress;
  }

  public updateCaseData(caseData: CaseDataResponse) {
    this.caseStage = caseData.stage;
    this.caseStatus = caseData.status;
  }

  public updateIllustrationData(illustrationData: IllustrationSummaryResponse) {
    this.illustrationSummary = illustrationData;
  }

  public updateDipData(dipData: DipSummaryResponse) {
    this.dipSummary = dipData;
    this.draftStage = dipData.stage;
    this.draftStatus = dipData.status;
    this.loanStage = dipData.loan?.stage;
    this.loanStatus = dipData.loan?.status;
    this.rejectionReasons = dipData.loan?.rejectionReasons || ([] as RejectionReasonResponse[]);
    this.dipExpirationDate = dipData.expirationDateTime;
  }

  public updateFmaData(fmaData: FMASummaryResponse) {
    this.fmaSummary = fmaData;
    this.draftStage = fmaData.stage;
    this.draftStatus = fmaData.status;
    this.loanStage = fmaData.loan?.stage;
    this.loanStatus = fmaData.loan?.status;
    this.rejectionReasons = fmaData.loan?.rejectionReasons || ([] as RejectionReasonResponse[]);
  }

  public resetData() {
    this.illustrationSummary = null;
    this.dipSummary = null;
    this.fmaSummary = null;
    this.draftStage = DraftStage.Undefined;
    this.draftStatus = DraftStatus.Undefined;
    this.loanStage = LoanStage.Undefined;
    this.loanStatus = LoanStatus.Undefined;
    this.rejectionReasons = [] as RejectionReasonResponse[];
  }

  public promoteIllustration(caseId: string, appId: string, loanId: number) {
    this.spinnerService.setIsLoading(true);
    this.illustrationService
      .illustrationPromoteIllustration(+appId, loanId, {
        versionNumber: 0,
      })
      .pipe(
        finalize(() => this.spinnerService.setIsLoading(false)),
        switchMap(() => this.caseService.caseGetDIPSummary(caseId)),
      )
      .subscribe((dipData: DipSummaryResponse) => {
        if (dipData.stage === LoanStage.Dip) this.caseStage = CaseStage.Dip;
        this.updateDipData(dipData);
        this.toastService.showMessage({
          summary: 'Illustration successfully promoted to DIP',
          severity: SeveritiesEnum.SUCCESS,
        });
      });
  }

  public promoteDip(caseId: string, appId: string, loanId: string) {
    this.spinnerService.setIsLoading(true);

    this.dipService
      .dIPPromoteDIP(+appId, +loanId)
      .pipe(
        finalize(() => this.spinnerService.setIsLoading(false)),
        switchMap(() => this.caseService.caseGetFMASummary(caseId)),
      )
      .subscribe((fmaData: FMASummaryResponse) => {
        if (fmaData.stage === LoanStage.Fma) this.caseStage = CaseStage.Fma;
        this.updateFmaData(fmaData);

        this.toastService.showMessage({
          summary: 'DIP successfully promoted to FMA',
          severity: SeveritiesEnum.SUCCESS,
        });
      });
  }

  public canEditIllustration(loanId: number, illustrationData: IllustrationSummaryResponse, status: string): boolean {
    const selectedIllustration = illustrationData?.illustrationSummaries?.find(illustration => illustration.loanId === loanId);
    const hasPermission = this.checkPermissionsService.checkPermissions({
      section: 'illustration',
      features: ['assignee'],
      neededPermission: PortalPermissionType.Illustration,
    });

    return !(
      !hasPermission ||
      selectedIllustration?.status === LoanStatus.Completed ||
      this.draftStage === DraftStage.Dip ||
      this.draftStage === DraftStage.Fma ||
      status === CaseStatusEnum.Cancelled
    );
  }

  /**
   * Checks if the user ONLY has view permissions in the DIP or if the DIP is in a read only stage
   *
   * @public
   */
  public canEditDip(): boolean {
    const hasPermission = this.checkPermissionsService.checkPermissions({
      section: 'dip',
      features: ['assignee'],
      neededPermission: PortalPermissionType.DecisionInPrinciple,
    });
    const readOnlyStatus = [LoanStatus.Completed, LoanStatus.Referred, LoanStatus.Assessment, LoanStatus.Submitted];

    return !(
      !hasPermission ||
      (this.draftStage === DraftStage.Dip && readOnlyStatus.includes(this.loanStatus as LoanStatus)) ||
      this.draftStage === DraftStage.Fma ||
      this.caseStatus === CaseStatusEnum.Cancelled
    );
  }

  /**
   * TODO: replace dipData with fmaData once fmaSummary call is ready
   * Checks if the user ONLY has view permissions in the FMA or if the FMA is in a read only stage
   *
   * @public
   */
  public canEditFma(): boolean {
    const hasPermission = this.checkPermissionsService.checkPermissions({
      section: 'fma',
      features: ['assignee'],
      neededPermission: PortalPermissionType.FullMortgageApplication,
    });
    const index = this.stepSetupService.currentJourney.findIndex(item => item.automationId === this.stepSetupService.currentStep);
    const lendingPolicyIndex = this.stepSetupService.currentJourney.findIndex(
      step => step.automationId === this.stepSetupService.lenderPolicyCheck.automationId,
    );
    const readOnlyStatus = [
      LoanStatus.Accepted,
      LoanStatus.Referred,
      LoanStatus.Documentation,
      LoanStatus.Rejected,
      LoanStatus.UnderwritingInProgress,
      LoanStatus.UnderwritingAccepted,
      LoanStatus.UnderwritingApproved,
    ];

    return !(
      !hasPermission ||
      this.draftStage === DraftStage.Dip ||
      (this.draftStage === DraftStage.Fma && this.draftStatus === DraftStatus.Completed) ||
      (this.draftStage === DraftStage.Fma && index < lendingPolicyIndex && readOnlyStatus.includes(this.loanStatus as LoanStatus)) ||
      this.caseStatus === CaseStatusEnum.Cancelled
    );
  }

  shouldRefreshDocuments(): boolean {
    return (
      this.draftStage === DraftStage.Fma ||
      (this.draftStage === DraftStage.Dip && this.loanStage === LoanStatus.Completed) ||
      (this.draftStage === DraftStage.Dip && this.loanStage === LoanStatus.Referred)
    );
  }

  refreshDocuments$(): Observable<boolean> {
    return combineLatest([this.draftStage$, this.loanStatus$]).pipe(
      map(([draftStage, loanStatus]) => {
        return (
          draftStage === DraftStage.Fma ||
          (draftStage === DraftStage.Dip && loanStatus === LoanStatus.Completed) ||
          (draftStage === DraftStage.Dip && loanStatus === LoanStatus.Referred)
        );
      }),
    );
  }

  getSecondarySummaries(secondaryCalls: SecondaryCalls, caseId: string) {
    if (secondaryCalls[CaseStage.Illustration] && this.caseStage !== CaseStage.Illustration) {
      this.caseService
        .caseGetIllustrationSummary(caseId)
        .pipe(take(1))
        .subscribe(data => {
          this.illustrationSummary = data;
        });
    }
    if (secondaryCalls[CaseStage.Dip] && this.caseStage !== CaseStage.Dip) {
      this.isLoadingDip = true;
      this.caseService
        .caseGetDIPSummary(caseId)
        .pipe(take(1))
        .subscribe(data => {
          this.dipSummary = data;
          this.isLoadingDip = false;
        });
    }
    if (secondaryCalls[CaseStage.Fma] && this.caseStage !== CaseStage.Fma) {
      this.caseService
        .caseGetFMASummary(caseId)
        .pipe(take(1))
        .subscribe(data => {
          this.fmaSummary = data;
        });
    }
  }

  public checkProductsAvailability(appId: number, loanId: number) {
    this.productService
      .productGetLoanProductsAvailability(appId, loanId)
      .pipe(take(1))
      .subscribe((response: LoanProductAvailabilityResponse) => {
        this.invalidLoanPartsProduct = response.productAvailability?.reduce(
          (arr: number[], loanPart: ProductAvailabilityResponse) =>
            loanPart.loanPartId && loanPart.status !== 'Ok' ? [...arr, loanPart.loanPartId] : arr,
          [],
        );
        if (this.invalidLoanPartsProduct?.length) {
          this.stepSetupService.invalidateStep(this.stepSetupService.productSelection.automationId);
          this.stepSetupService.invalidateStep(this.stepSetupService.adviceFees.automationId);
        } else if (response.productAvailability?.length) {
          // TODO IMPROVE: this can not be truth if the step is not valid for some other reasons like invalid form
          this.dataService.setFormStatus('VALID', this.stepSetupService.productSelection.automationId);
        }
      });
  }

  public checkProductAvailability(
    appId: number,
    loanId: number,
    loanPartId: number,
    tomYears?: number,
    tomMonths?: number,
    productCode?: string,
  ) {
    this.productService
      .productGetLoanPartProductsAvailability(appId, loanId, loanPartId, tomYears, tomMonths, productCode)
      .pipe(take(1))
      .subscribe((response: LoanProductAvailabilityResponse) => {
        const alreadyInvalid = this.invalidLoanPartsProduct?.includes(loanPartId);
        if (this.invalidLoanPartsProduct === null) return;
        if (response.productAvailability?.[0]?.status === 'Ok' && alreadyInvalid) {
          this.invalidLoanPartsProduct = this.invalidLoanPartsProduct?.filter(el => el !== loanPartId);
        } else if (response.productAvailability?.[0]?.status === 'Not available' && !alreadyInvalid) {
          this.invalidLoanPartsProduct = [...(this.invalidLoanPartsProduct || []), loanPartId];
        }
      });
  }
}
