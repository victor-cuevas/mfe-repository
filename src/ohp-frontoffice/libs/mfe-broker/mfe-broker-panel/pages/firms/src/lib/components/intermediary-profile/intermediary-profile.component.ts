import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';

import {
  getPanelUser,
  IntermediaryDetailsService,
  loadPanelUserFailure,
  loadPanelUserSuccess,
  RoutePaths,
} from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  AuthorizationContextModel,
  FirmDetailsModel,
  IntermediaryFcaDetailsModel,
  IntermediaryResponse,
  IntermediaryRole,
  IntermediaryService,
  IntermediaryStatus,
  PermissionType,
  PortalUserService,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { AccountInfoComponent, DialogData, PersonalDetailsComponent, UserRoleComponent } from '@close-front-office/mfe-broker/shared-ui';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { CheckPermissionsServiceInterface, PERMISSIONS, SpinnerService } from '@close-front-office/mfe-broker/core';

@Component({
  templateUrl: './intermediary-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntermediaryProfileComponent implements AfterViewInit {
  @ViewChild(UserRoleComponent) userRole!: UserRoleComponent;
  @ViewChild(AccountInfoComponent) accountInfo?: AccountInfoComponent;
  @ViewChild(PersonalDetailsComponent) personalDetails?: PersonalDetailsComponent;

  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryStatus: typeof IntermediaryStatus = IntermediaryStatus;
  status = new FormControl();
  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  firmDetails: FirmDetailsModel = this.activatedRoute.snapshot.parent?.data.fetchedData?.firmDetails;
  firmId = this.activatedRoute.snapshot.parent?.paramMap.get('id');
  showResendInvitationPopup = false;
  showCancelInvitation = false;
  showChangeStatusPopup = false;
  dataDialog: { header: string; content: string } | undefined;
  editProfileForm = this.fb.group({
    status: [this.intermediaryDetails?.status === IntermediaryStatus.Active],
    isUnderReview: this.intermediaryDetails?.isInReview,
  });
  sendInvitationDataPopup: DialogData | undefined;
  cancelInvitationDataPopup: DialogData | undefined;
  changeStatusDataPopup: DialogData | undefined;
  underReviewPopup: DialogData | undefined;
  showUnderReviewPopup = false;
  hasFCADetail = false;
  lockDefaultStructure = false;
  readOnly =
    this.route.snapshot.data.readOnlyMode ||
    !this.checkPermissionService.checkPermissions({
      section: 'profiles',
      features: ['firm', 'lender'],
    });

  private loggedInUser: AuthorizationContextModel | undefined;
  private onDestroy$ = new Subject<boolean>();

  get fullName() {
    return `${this.personalDetails?.personalDetailsForm.controls.firstName.value} ${this.personalDetails?.personalDetailsForm.controls.surName.value}`;
  }

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private toastService: ToastService,
    private intermediaryService: IntermediaryService,
    private store: Store,
    private panelUserService: PortalUserService,
    private intermediaryDetailsService: IntermediaryDetailsService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.store
      .select(getPanelUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(user => (this.loggedInUser = user));
  }

  ngAfterViewInit(): void {
    if (this.readOnly) {
      this.editProfileForm.controls.status.disable();
      this.editProfileForm.controls.isUnderReview.disable();
    }
    this.userRole?.userRoleForm.reset(this.mapToUserRole());
    this.personalDetails?.personalDetailsForm.reset(this.mapToFormPersonalDetails());
    this.editProfileForm.controls.isUnderReview.setValue(this.intermediaryDetails?.isInReview);
    this.enableAdvisorUniqueId();
    this.cd.detectChanges();
  }

  updateProfile() {
    if (this.allFormsAreValid()) {
      this.spinner.setIsLoading(true);
      this.intermediaryService
        .intermediaryPutIntermediary(this.intermediaryDetails.intermediaryId || '', this.mapToDTO())
        .pipe(
          finalize(() => this.spinner.setIsLoading(false)),
          takeUntil(this.onDestroy$),
        )
        .subscribe(() => {
          this.intermediaryService.intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId || '').subscribe(response => {
            this.intermediaryDetails = response;
            this.intermediaryDetailsService.setIntermediaryDetails(response);
          });
          if (
            this.intermediaryDetails.intermediaryId === this.loggedInUser?.intermediaryId ||
            this.intermediaryDetails.roleMappings?.some(el => el.brokerId === this.loggedInUser?.intermediaryId)
          ) {
            this.panelUserService.portalUserGetMe().subscribe(
              response => {
                return this.store.dispatch(loadPanelUserSuccess({ entity: response }));
              },
              (error: any) => {
                return this.store.dispatch(loadPanelUserFailure({ error }));
              },
            );
          }
          this.toastService.showMessage({
            summary: `The profile of ${this.fullName} has been edited successfully`,
          });
        });
    }
  }

  /* Resend Invitation */
  openResendInvitationModal() {
    this.showResendInvitationPopup = true;
    this.sendInvitationDataPopup = {
      type: 'success',
      icon: 'pi pi-send',
      header: this.translate.instant('dialog.headerResendInvitation'),
      content: this.translate.instant('dialog.contentResendInvitation'),
    };
  }

  cancelResendInvitation() {
    this.showResendInvitationPopup = false;
  }

  confirmResendInvitation() {
    this.showResendInvitationPopup = false;
    //TODO: Implementing the resend invitation logic
  }

  /* Cancel Invitation */
  openCancelInvitationModal() {
    this.showCancelInvitation = true;
    this.cancelInvitationDataPopup = {
      type: 'danger',
      icon: 'pi pi-times',
      header: this.translate.instant('dialog.cancelInvitation'),
      content: this.translate.instant('dialog.cancelInvitationMsg'),
    };
  }

  cancelCancelInvitation() {
    this.showCancelInvitation = false;
  }

  confirmCancelInvitation() {
    this.spinner.setIsLoading(true);
    this.intermediaryService
      .intermediaryPutIntermediaryStatus(this.intermediaryDetails.intermediaryId || '', { status: IntermediaryStatus.Inactive })
      .pipe(
        takeUntil(this.onDestroy$),
        finalize(() => this.spinner.setIsLoading(false)),
      )
      .subscribe(() => {
        this.showCancelInvitation = false;
        this.toastService.showMessage({
          summary: `The profile of ${this.fullName} has been edited successfully`,
        });
      });
  }

  /* Switch Status */
  onSwitchStatus(event: any) {
    this.showChangeStatusPopup = true;
    this.changeStatusDataPopup = {
      type: 'success',
      icon: event.checked ? 'pi pi-user-plus' : 'pi pi-user-minus',
      header: this.translate.instant(event.checked ? 'dialog.active' : 'dialog.inactive'),
      content: this.translate.instant(event.checked ? 'dialog.changeStatusActiveMsg' : 'dialog.changeStatusInactiveMsg'),
    };
  }

  cancelChangeStatus() {
    this.editProfileForm.controls.status.setValue(!this.editProfileForm.controls.status.value);
    this.showChangeStatusPopup = false;
  }

  confirmChangeStatus() {
    this.spinner.setIsLoading(true);
    this.showChangeStatusPopup = false;
    this.intermediaryService
      .intermediaryPutIntermediaryStatus(this.intermediaryDetails.intermediaryId || '', {
        status: this.editProfileForm.controls.status.value ? IntermediaryStatus.Active : IntermediaryStatus.Inactive,
      })
      .pipe(
        takeUntil(this.onDestroy$),
        finalize(() => this.spinner.setIsLoading(false)),
      )
      .subscribe(
        () => {
          this.toastService.showMessage({
            summary: `The status of ${this.fullName} has been changed successfully`,
          });
        },
        () => {
          this.editProfileForm.controls.status.setValue(!this.editProfileForm.controls.status.value);
        },
      );
  }

  /* Switch Under Review */
  onSwitchUnderReview() {
    this.showUnderReviewPopup = true;
    this.underReviewPopup = {
      type: 'success',
      icon: 'pi pi-user-edit',
      header: this.translate.instant('dialog.underReview'),
      content: this.translate.instant('dialog.underReviewMsg'),
    };
  }

  cancelUnderReview() {
    this.editProfileForm.controls.isUnderReview.setValue(!this.editProfileForm.controls.isUnderReview.value);
    this.showUnderReviewPopup = false;
  }

  confirmUnderReview() {
    this.spinner.setIsLoading(true);
    this.intermediaryService
      .intermediaryPutIntermediaryReview(this.intermediaryDetails.intermediaryId || '', {
        isInReview: this.editProfileForm.controls.isUnderReview.value,
      })
      .pipe(
        finalize(() => this.spinner.setIsLoading(false)),
        concatMap(() => this.intermediaryService.intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId || '')),
      )
      .subscribe(resp => (this.intermediaryDetails = resp));
    this.showUnderReviewPopup = false;
  }

  private mapToFormPersonalDetails() {
    return {
      title: this.intermediaryDetails.person?.title,
      firstName: this.intermediaryDetails.person?.firstName,
      surName: this.intermediaryDetails.person?.lastName,
      dob: new Date(this.intermediaryDetails.person?.dateOfBirth || ''),
    };
  }

  private mapToUserRole() {
    return {
      firmName: this.firmDetails.firmName,
      userRole: this.intermediaryDetails.intermediaryRole,
      advisorUniqueId: this.intermediaryDetails.advisorUniqueId,
    };
  }

  private allFormsAreValid(): boolean {
    this.editProfileForm.markAllAsTouched();
    this.userRole?.userRoleForm.markAllAsTouched();
    this.personalDetails?.personalDetailsForm.markAllAsTouched();

    return !!(this.userRole?.userRoleForm.valid && this.editProfileForm.valid && this.personalDetails?.personalDetailsForm.valid);
  }

  populateData(advisorUniqueID: string) {
    if (advisorUniqueID) {
      this.spinner.setIsLoading(true);
      this.hasFCADetail = true;
      this.lockDefaultStructure = true;
      this.intermediaryService
        .intermediaryGetIntermediaryFcaDetails(advisorUniqueID, 'response')
        .pipe(finalize(() => this.spinner.setIsLoading(false)))
        .subscribe((resp: HttpResponse<IntermediaryFcaDetailsModel>) => {
          if (resp.status === 200) {
            const name: string[] = resp.body?.fullName.split(' ') as Array<string>;
            this.personalDetails?.personalDetailsForm.controls.firstName.setValue(name[0]);
            this.personalDetails?.personalDetailsForm.controls.surName.setValue(name[name.length - 1]);
            this.userRole.userRoleForm.controls.advisorUniqueId.markAsDirty();
            this.userRole.userRoleForm.controls.advisorUniqueId.setErrors(null);
          }
          if (resp.status === 204) {
            this.userRole?.userRoleForm.get('advisorUniqueId')?.setErrors({ isValidAdvisorUniqueID: true });
            this.cd.detectChanges();
          }
        });
    }
  }

  unlockDefaultStructure() {
    this.hasFCADetail = false;
  }

  private mapToDTO(): any {
    const userRoleValue = this.userRole?.userRoleForm.getRawValue();
    const personalDetails = this.personalDetails?.personalDetailsForm.getRawValue();

    return {
      ...this.intermediaryDetails,
      advisorUniqueId: userRoleValue.advisorUniqueId,
      intermediaryRole: userRoleValue.userRole,
      permissionType:
        this.intermediaryDetails.intermediaryRole == IntermediaryRole.Advisor
          ? PermissionType.FullMortgageApplication
          : PermissionType.View, // TODO remove when BFF remove it from the model
      person: {
        title: personalDetails.title,
        firstName: personalDetails.firstName,
        lastName: personalDetails.surName,
        dateOfBirth: new Date(personalDetails.dob.getTime() - personalDetails.dob.getTimezoneOffset() * 60 * 1000).toISOString(),
      },
    };
  }

  private enableAdvisorUniqueId() {
    if (
      this.checkPermissionService.checkPermissions({
        section: 'profiles',
        features: ['firm', 'lender'],
      })
    )
      this.userRole.userRoleForm.controls.advisorUniqueId.enable();
  }
}
