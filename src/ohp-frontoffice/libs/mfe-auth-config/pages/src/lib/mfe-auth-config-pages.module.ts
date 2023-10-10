import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { fluidValidationService, SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ManageRecoveryUsersComponent } from './components/manage-recovery-users/manage-recovery-users.component';
import { ManageRecoveryUserProfileComponent } from './components/manage-recovery-user-profile/manage-recovery-user-profile.component';
import { RecoveryUserProfileResolver } from './components/manage-recovery-user-profile/resolver/recovery-user-profile.resolver';
import { ManageUserResolver } from './components/manage-user/resolver/manage-user.resolver';
import { UserProfileResolver } from './components/user-profile/resolver/user-profile.resolver';
import { ManageUserService } from './components/manage-user/service/manage-user.service';
import { UserProfileService } from './components/user-profile/service/user-profile.service';
import { RecoveryUserLanguageListResolver } from './components/manage-recovery-users/resolver/recovery-user.resolver';
import { ActionReceiverResolver } from './components/manage-recovery-users/resolver/action-receiver.resolver';
import { ServicingLabelRefResolver } from './components/manage-recovery-users/resolver/servicing-label-ref.resolver';
import { UserProfileListResolver } from './components/manage-recovery-users/resolver/user-profile-list.resolver';
import { RecoveryUserProfileScreenDataResolver } from './components/manage-recovery-user-profile/resolver/recovery-user-profile-screen-data.resolver';
import { UserProfileLimitationResolver } from './components/manage-recovery-users/resolver/user-profile-limitation.resolver';
const routes: Routes = [
  {
    path: '',
    component: ManageUserComponent,
    resolve: { userAssociationData: ManageUserResolver }
  },
  {
    path: 'manage-user',
    component: ManageUserComponent,
    resolve: { userAssociationData: ManageUserResolver }
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    resolve: { userProfileData: UserProfileResolver }
  },
  {
    path: 'manage-recovery-users',
    component: ManageRecoveryUsersComponent,
    resolve: { recoveryLanguageListData: RecoveryUserLanguageListResolver,
      actionReciverList:ActionReceiverResolver,
      servicingLabelRefList: ServicingLabelRefResolver,
      userProfileLimitationList: UserProfileLimitationResolver,
      userProfileList:UserProfileListResolver
     }
  },
  {
    path: 'manage-recovery-user-profile',
    component: ManageRecoveryUserProfileComponent,
    resolve: { recoveryUserProfileData: RecoveryUserProfileResolver, recoveryUserProfileScreenData: RecoveryUserProfileScreenDataResolver }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [ManageUserComponent, UserProfileComponent, ManageRecoveryUsersComponent, ManageRecoveryUserProfileComponent],
  providers: [NgForm, ManageUserService, UserProfileService, fluidValidationService]
})
export class MfeAuthConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'authorisation');
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
