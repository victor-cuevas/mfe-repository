import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcurationFeeModel, ProcurationFeesService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mbpanel-procuration-fee-configuration',
  templateUrl: './procuration-fee-configuration.component.html',
})
export class ProcurationFeeConfigurationComponent implements AfterViewInit {
  applicationType? = this.router.url.split('/').pop()?.toLowerCase();
  procurationFees: ProcurationFeeModel[] = [];
  submissionRoute: Array<string> = [];
  procurationFeeConfigurationForm: FormArray = this.fb.array([]);
  isReadOnlyMode = this.route.parent?.snapshot.data.readOnlyMode;

  completionOptions = [
    { label: this.translate.instant('configuration.options.bps'), value: 'BasisPoints' },
    { label: this.translate.instant('configuration.options.pounds'), value: 'Currency' },
  ];

  basedOnOptions = [
    { label: this.translate.instant('configuration.options.loanAmount'), value: 'LoanAmount' },
    { label: this.translate.instant('configuration.options.outstandingBalance'), value: 'OutstandingBalance' },
  ];

  endingOptions = [
    { label: this.translate.instant('configuration.options.redemption'), value: 'Redemption' },
    { label: this.translate.instant('configuration.options.initialTerm'), value: 'InitialTerm' },
    { label: this.translate.instant('configuration.options.initialTermUnlessRedeemed'), value: 'InitialTermUnlessRedeemed' },
  ];

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    public router: Router,
    private fb: FormBuilder,
    private procurationFeesService: ProcurationFeesService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.procurationFeesService.procurationFeesGetAllProcurationFees().subscribe(response => {
      if (response) {
        this.procurationFees = response;
      }

      this.procurationFees.forEach(el => {
        if (el.applicationType.toLocaleLowerCase() === this.applicationType) {
          this.submissionRoute.push(el.submissionRouteType);

          const configurationsAll: FormGroup = this.fb.group({
            applicationTypeHidden: el.applicationType,
            submissionRouteHidden: el.submissionRouteType,
            completionInput: [el.completionFee.value, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
            completionOptions: el.completionFee.unit,
            basedOnCompletion: el.completionFee.basis,
            trailInput: [el.trailFee?.value, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
            trailOptions: el.trailFee?.unit || this.completionOptions[0].value,
            basedOnTrail: el.trailFee?.basis || this.basedOnOptions[0].value,
            startingMonth: [el.trailFee?.startingMonth, Validators.compose([Validators.required, Validators.min(1), Validators.max(240)])],
            ending: el.trailFee?.endingType || this.endingOptions[0].value,
            period: [el.trailFee?.periodInMonths, Validators.compose([Validators.required, Validators.min(1), Validators.max(60)])],
          });

          this.procurationFeeConfigurationForm.push(configurationsAll);
        }
      });
    });
    if (this.isReadOnlyMode) {
      setTimeout(() => {
        this.procurationFeeConfigurationForm.disable({ emitEvent: false });
      }, 500);
    }
    this.cd.detectChanges();
  }

  updateConfiguration(index: number) {
    this.spinnerService.setIsLoading(true);
    const body = this.mapToDTO(this.procurationFeeConfigurationForm.at(index) as FormGroup);
    this.procurationFeesService
      .procurationFeesPut(body)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(() => {
        this.toastService.showMessage({ summary: 'Configuration updated' });
      });
  }

  private mapToDTO(form: FormGroup): any {
    const rawValueForm = form.value;

    return {
      applicationType: rawValueForm.applicationTypeHidden,
      submissionRouteType: rawValueForm.submissionRouteHidden,
      completionFee: {
        value: rawValueForm.completionInput,
        unit: rawValueForm.completionOptions,
        basis: rawValueForm.basedOnCompletion,
      },
      trailFee: {
        value: rawValueForm.trailInput,
        unit: rawValueForm.trailOptions,
        basis: rawValueForm.basedOnTrail,
        startingMonth: rawValueForm.startingMonth,
        periodInMonths: rawValueForm.period,
        endingType: rawValueForm.ending,
      },
    };
  }
}
