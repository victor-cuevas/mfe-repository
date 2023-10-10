import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigContextService } from '@close-front-office/shared/config';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'close-front-office-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit {
    mfesData: any = [];
    isRouted!:boolean;

    mfesSubRoutes: any = [
      {
        mfeName: "authorisation",
        components: [
          {
            title: 'Manage Users',
            route: 'authorisation/manage-user'
          },
          {
            title: 'Manage User Profile',
            route: 'authorisation/user-profile'
          },
          {
            title: 'Manage Recovery Users',
            route: 'authorisation/manage-recovery-users'
          },
          {
            title: 'Manage Recovery User Profiles',
            route: 'authorisation/manage-recovery-user-profile'
          }
        ]
      },
      {
        mfeName: "process",
        components: [
          {
            title: 'Manage BO Event Configuration',
            route: 'process/event-config'
          },
          {
            title: 'Manage BO Process Event Configuration',
            route: 'process/followup-event-config'
          },
          {
            title: 'Manage Followup Configuration',
            route: 'process/manage-followup-config'
          },
          {
            title: 'Manage Notifications Configuration',
            route: 'process/manage-notification-config'
          },
          {
            title: 'Manage Reminder Scenarios',
            route: 'process/manage-reminder-scenario'
          },
          {
            title: 'Manage FUP Casestatus Vs Dossierstatus',
            route: 'process/followup-case2-dunning-dossier'
          },
          {
            title: 'Manage CM Process Event Configuration',
            route: 'process/followup-event-configuration'
          },
          {
            title: 'Manage CM Event Configuration',
            route: 'process/event-configuration'
          },
        ]
      },
      {
        mfeName: "accounting",
        components: [
          {
            title: 'Manage AM Credit Provider',
            route: 'accounting/credit-provider'
          },
          {
            title: 'Manage AM Divergent Effective Ratesheet',
            route: 'accounting/divergent-effective'
          },
          {
            title: 'Manage AM Mutation Types',
            route: 'accounting/mutation-type'
          },
          {
            title: 'Manage AM Periodicities',
            route: 'accounting/periodicity-config'
          },
          {
            title: 'Manage AM Transactions',
            route: 'accounting/txtype-config'
          },
          {
            title: 'Manage AM Interestmediation Surcharge',
            route: 'accounting/interest-mediation'
          },
          {
            title: 'Manage AM LTV Modifications',
            route: 'accounting/ltv-modification'
          },
        ]
      },
      {
        mfeName: "taxstatement",
        components: [
          {
            title: 'Manage Tax Certificate Transactions',
            route: 'taxstatement/tax-credit-provider'
          },
          {
            title: 'Manage Tax Certificate Mapping',
            route: 'taxstatement/tax-type-mapping'
          },
          {
            title: 'Manage Tax Certificate System Parameters',
            route: 'taxstatement/tax-system-config'
          },
        ]
      },
      {
        mfeName: "asset",
        components: [
          {
            title: 'Manage Asset Valuation',
            route: 'asset/manage-indexation'
          },
        ]
      },
      {
        mfeName: "collection-measure",
        components: [
          {
            title: 'Manage Collection Measure',
            route: 'collection-measure/collection-measure-config'
          },
        ]
      },
      {
        mfeName: "communication",
        components: [
          {
            title: 'Manage CO Communication Fallback',
            route: 'communication/fallback-mechanism'
          },
          {
            title: 'Print Document Filter',
            route: 'communication/print-document-filter'
          },
          {
            title: 'Manage Communication Medium',
            route: 'communication/communication-medium'
          },
          {
            title: 'Manage Communication Dossierstatus',
            route: 'communication/communication-outcome'
          },
          {
            title: 'Manage Communication Receiver Vs Roletype',
            route: 'communication/communication-receiver'
          },
          {
            title: 'Manage Communication Defaultreferencetype',
            route: 'communication/default-reference-type'
          },
          {
            title: 'Manage CM Communication Fallback',
            route: 'communication/fall-back-mechanism-cm'
          },
          {
            title: 'Manage Documenttemplate',
            route: 'communication/document-templatebase'
          },
        ]
      },
      {
        mfeName: "runningaccount",
        components: [
          {
            title: 'Manage IM Balancemovementtype Vs Distrubutiontype',
            route: 'runningaccount/balancemovementtype2distributiontype'
          },
          {
            title: 'Manage IM Owner Vs Participant Mapping',
            route: 'runningaccount/owner2participantMapping'
          },
          {
            title: 'Manage IM Txel vs Balancemovementtype Mapping',
            route: 'runningaccount/txEl2BalMovTypeMapping'
          },
          {
            title: 'Manage IM Accounting',
            route: 'runningaccount/runnAccBookingPlan'
          },
        ]
      },
      {
        mfeName: "appinstance",
        components: [
          {
            title: 'ArrearsConfiguration ArrearsConfiguration2TxElType',
            route: 'appinstance/arrears-configuration'
          },
          {
            title: 'Manage Integration Data Fields Configuration',
            route: 'appinstance/manage-integration'
          },
          {
            title: 'Manage Credit Provider Config',
            route: 'appinstance/manage-credit-provider'
          },
          {
            title: 'Manage Legislation',
            route: 'appinstance/manage-legislation'
          },
          {
            title: 'Manage Rate Revision',
            route: 'appinstance/manage-rate-revision'
          },
          {
            title: 'Manage Revision Periods',
            route: 'appinstance/revision-period-definition'
          },
          {
            title: 'Manage Prepayment Reason Penalty',
            route: 'appinstance/prepayment-reason'
          },
          {
            title: 'Manage BO Generic Mapping',
            route: 'appinstance/generic-mapping'
          },
          {
            title: 'Manage Freefields',
            route: 'appinstance/free-field-config'
          },
          {
            title: 'Manage Codetables',
            route: 'appinstance/code-table-parameter'
          },
          {
            title: 'Manage CM Generic Mapping',
            route: 'appinstance/generic-mapping-cm'
          },
          {
            title: 'Manage Roletype Vs Partyquality',
            route: 'appinstance/role-type'
          },
        ]
      },
      {
        mfeName: "financial",
        components: [
          {
            title: 'Manage Due Amount Sorting',
            route: 'financial/due-amount-sorting'
          },
          {
            title: 'Manage Value Reduction',
            route: 'financial/value-reduction'
          },
          {
            title: 'Manage Fee Configuration',
            route: 'financial/manage-fee'
          },
          {
            title: 'Manage Cost',
            route: 'financial/manage-cost'
          },
        ]
      },
      {
        mfeName: "agenda",
        components: [
          {
            title: 'Master Agenda',
            route: 'agenda'
          },
          {
            title: 'Manage Holiday Calendar',
            route: 'agenda/manage-holiday-cal'
          },
          {
            title: 'Manage Actions',
            route: 'agenda/manage-action'
          },
          {
            title: 'Action Receiver',
            route: 'agenda/action-receiver'
          }
        ]
      },
      {
        mfeName: "product",
        components: [
          {
            title: 'Search Product',
            route: 'product/search-product'
          },
          {
            title: 'New Product',
            route: 'product/new-product'
          },
          {
            title: 'Manage Credit Mutation',
            route: 'product/credit-mutation'
          },
          {
            title: 'Manage Depot Product',
            route: 'product/depot-product'
          },
          {
            title: 'Manage Related Product',
            route: 'product/related-product-definition'
          },

          {
            title: 'Manage Depot Purpose',
            route: 'product/depot-purpose-product'
          },
              ]
      },

      {
      mfeName: "plan",
      components: [
        {
          title: 'Manage Treatment Plan Configuration',
          route: 'plan/treatment-plan'
        },
        {
          title: 'Manage Reminder Flow Configuration',
          route: 'plan/reminder-plan'
        },
        {
          title: 'Manage Rule Engine Plan Derivation',
          route: 'plan/rule-engine-plan-derivation'
        },
        {
          title: 'Manage Arrearstrigger Plan',
          route: 'plan/arrears-trigger-plan'
        }
      ]
    }

    ]

  constructor(private configData: ConfigContextService, private route: Router, public spinnerService : SpinnerService) { }

  ngOnInit(): void {
    const configData: any = this.configData;
    this.mfesData = configData.configContext.REMOTE_MFES;
    if (!localStorage.getItem('refresh')) {
      localStorage.setItem('refresh', 'no');
      window.location.reload();
    } else {
      localStorage.removeItem('refresh')
    }
  }

  navigation(data: any) {
    this.isRouted = false;
    this.spinnerService.setIsLoading(true);

    this.route.navigate([`/${data}`]).then((response)=>{
      this.spinnerService.setIsLoading(false);
      this.isRouted = true;
    });
   }
  }
