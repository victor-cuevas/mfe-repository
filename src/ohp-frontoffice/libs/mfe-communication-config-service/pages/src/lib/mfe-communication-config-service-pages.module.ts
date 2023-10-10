import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FallbackMechanismComponent } from './components/fallback-mechanism/fallback-mechanism.component';
import { PrintDocumentFilterComponent } from './components/print-document-filter/print-document-filter.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { FallbackMechanismResolver } from './components/fallback-mechanism/Resolvers/fallback-mechanism.resolver';
import { CommunicationMediumListResolver } from './components/fallback-mechanism/Resolvers/communication-medium-list.resolver';
import { FollowUpEventNameListResolver } from './components/fallback-mechanism/Resolvers/follow-up-event-name-list.resolver';
import { PrintDocumentFilterConfigScreenResolver } from './components/print-document-filter/Resolvers/print-document-filter-config-screen.resolver';
import { CommunicationMediumComponent } from './components/communication-medium/communication-medium.component';
import { CommunicationOutcomeComponent } from './components/communication-outcome/communication-outcome.component';
import { CommunicationReceiverComponent } from './components/communication-receiver/communication-receiver.component';
import { DefaultReferenceTypeComponent } from './components/default-reference-type/default-reference-type.component';
import { FallBackMechanismCmComponent } from './components/fall-back-mechanism-cm/fall-back-mechanism-cm.component';
import { CommunicationMediumNameListResolver } from './components/communication-medium/Resolvers/communicationMediumName-list-resolver';
import { DocumentTemplateTypeListResolver } from './components/communication-medium/Resolvers/documentTemplateType-list-resolver';
import { CommunicationMediumResolver } from './components/communication-medium/Resolvers/communicationMedium2DocumentTemplate.resolver';
import { GetCommunicationOutcomeResolver } from './components/communication-outcome/Resolvers/get-communication-outcome.resolver';
import { GetCommunicationOutcome2DossierStatusResolver } from './components/communication-outcome/Resolvers/get-communication-outcome2-dossier-status.resolver';
import { GetDossierPhaseResolver } from './components/communication-outcome/Resolvers/get-dossier-phase.resolver';
import { GetDossierStatusResolver } from './components/communication-outcome/Resolvers/get-dossier-status.resolver';
import { GetSubStatusResolver } from './components/communication-outcome/Resolvers/get-sub-status.resolver';
import { CommunicationReceiverListResolver } from './components/communication-receiver/Resolvers/communicationReceiver-list-resolver';
import { RoleTypeListResolver } from './components/communication-receiver/Resolvers/roleType-list-resolver';
import { CommunicationReceiverResolver } from './components/communication-receiver/Resolvers/communicationReceiver2RoleType.resolver';
import { cmFollowUpEventNameListResolver } from './components/fall-back-mechanism-cm/Resolvers/follow-up-event-name-list.resolver';
import { cmFallbackMechanismResolver} from './components/fall-back-mechanism-cm/Resolvers/fallback-mechanism.resolver';
import { CmCommunicationMediumListResolver} from './components/fall-back-mechanism-cm/Resolvers/communication-medium-list.resolver';
import { DocumentTemplatebaseComponent } from './components/document-templatebase/document-templatebase.component';
import { DocumentTemplateBaseResolver } from './components/document-templatebase/Resolvers/documentTemplates.resolver';
import { DocGenTypeListResolver } from './components/document-templatebase/Resolvers/docGenType-list-resolver';
import { OutputFormatListResolver } from './components/document-templatebase/Resolvers/outputFormat-list-resolver';
import { DocGenDtoNameListResolver } from './components/document-templatebase/Resolvers/docGenDtoName-list-resolver';
import { DocumentTemplateTypesListResolver } from './components/document-templatebase/Resolvers/documentTemplateType-list-resolver';
import { DefaultReferenceTypeResolver } from './components/default-reference-type/Resolvers/default-reference-type.resolver';
import { referenceType } from './components/default-reference-type/Models/referenceType.model';
import { ReferenceTypeResolver } from './components/default-reference-type/Resolvers/reference-type.resolver';
import { ReferenceTypeUsageResolver } from './components/default-reference-type/Resolvers/reference-type-usage.resolver';


const routes: Routes = [
  {
    path: '',
    component: FallbackMechanismComponent,
    resolve: {
      fallBackData: FallbackMechanismResolver,
      getCommunicationList: CommunicationMediumListResolver,
      followupNameList: FollowUpEventNameListResolver
    }
  },
  {
    path: 'fallback-mechanism',
    component: FallbackMechanismComponent,
    resolve: {
      fallBackData: FallbackMechanismResolver,
      getCommunicationList: CommunicationMediumListResolver,
      followupNameList: FollowUpEventNameListResolver
    }
  },
  {
    path: 'print-document-filter',
    component: PrintDocumentFilterComponent,
    resolve: { printdocumentdata: PrintDocumentFilterConfigScreenResolver }
  },
  {
    path: 'communication-medium',
    component: CommunicationMediumComponent,
    resolve: {
      communicationMediumData: CommunicationMediumResolver,
      communicationMediumNameList: CommunicationMediumNameListResolver,
      documentTemplateTypeList: DocumentTemplateTypeListResolver
    }
  },
  {
    path: 'communication-outcome',
    component: CommunicationOutcomeComponent,
    resolve:{communicationOutcomeList: GetCommunicationOutcomeResolver,
      communicationoutcome2dossierList:GetCommunicationOutcome2DossierStatusResolver,
      dossierPhaseList:GetDossierPhaseResolver,
      dossierStatusList:GetDossierStatusResolver,
      subStatusList:GetSubStatusResolver
    }
  },
  {
    path: 'communication-receiver',
    component: CommunicationReceiverComponent,
    resolve: {
      communicationReceiverData: CommunicationReceiverResolver,
      communicationReceiverList: CommunicationReceiverListResolver,
      roleTypeList: RoleTypeListResolver
    }
  },
  {
    path: 'default-reference-type',
    component: DefaultReferenceTypeComponent,
    resolve: {
      defaultRefData: DefaultReferenceTypeResolver,
      refTypeData: ReferenceTypeResolver,
      RefTypeUsageData: ReferenceTypeUsageResolver
    }
  },
  {
    path: 'fall-back-mechanism-cm',
    component: FallBackMechanismCmComponent,
    resolve: {
      fallBackData: cmFallbackMechanismResolver,
      getCommunicationList: CmCommunicationMediumListResolver,
      followupNameList: cmFollowUpEventNameListResolver
    }
  },  
  {
    path: 'document-templatebase',
    component: DocumentTemplatebaseComponent,
    resolve: {
      documentTemplateBaseData: DocumentTemplateBaseResolver,
      docGenTypeList: DocGenTypeListResolver,
      documentTemplateTypeList: DocumentTemplateTypesListResolver,
      outputFormatList:OutputFormatListResolver,
      docGenDtoNameList:DocGenDtoNameListResolver
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [
    FallbackMechanismComponent,
    PrintDocumentFilterComponent,
    CommunicationMediumComponent,
    CommunicationOutcomeComponent,
    CommunicationReceiverComponent,
    DefaultReferenceTypeComponent,
    FallBackMechanismCmComponent,
    DocumentTemplatebaseComponent
  ],
  providers: [HttpClient, DatePipe]
})
export class MfeCommunicationConfigServicePagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication');
    if (mfeConfig) {
      const el = document.getElementById('whitelabel-config-styles');

      if (!el) {
        const headEl = document.getElementsByTagName('head')[0];
        const styleLinkEl = document.createElement('link');
        styleLinkEl.rel = 'stylesheet';
        styleLinkEl.id = 'whitelabel-config-styles';
        styleLinkEl.href = `${mfeConfig.remoteUrl}/whitelabel-config-styles.css`;
        headEl.appendChild(styleLinkEl);
      }
    }
  }
}
