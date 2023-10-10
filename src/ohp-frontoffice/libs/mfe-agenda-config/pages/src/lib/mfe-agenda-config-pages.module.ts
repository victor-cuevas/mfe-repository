import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageHolidayCalendarComponent } from './components/manage-holidaycalendar/manage-holidaycalendar.component';
import { MasterAgendaComponent } from './components/master-agenda/master-agenda.component';
import { ManageActionComponent } from './components/manage-action/manage-action.component';
import { ActionReceiverComponent } from './components/action-receiver/action-receiver.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HolidayCalendarResolver } from './components/manage-holidaycalendar/resolvers/holiday-calendar.resolver';
import { ManageActionResolver } from './components/manage-action/resolvers/manage-action.resolver';
import { ActionReciverResolver } from './components/action-receiver/Resolvers/action-reciver.resolver';
import { MasterAgendaResolver } from './components/master-agenda/Resolvers/master-agenda.resolver';
import { ConfigContextService } from '@close-front-office/shared/config';

const routes: Routes = [
  {
    path: '',
    component: MasterAgendaComponent,
    resolve: { masteragendaData: MasterAgendaResolver }
  },
  {
    path: 'master-agenda',
    component: MasterAgendaComponent,
    resolve: { masteragendaData: MasterAgendaResolver }
  },
  {
    path: 'manage-holiday-cal',
    component: ManageHolidayCalendarComponent,
    resolve: { holidayCalenderData: HolidayCalendarResolver }
  },
  {
    path: 'manage-action',
    component: ManageActionComponent,
    resolve: { actionData: ManageActionResolver }
  },
  {
    path: 'action-receiver',
    component: ActionReceiverComponent,
    resolve:{actionReciverData:ActionReciverResolver}
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, FormsModule, TranslateModule],
  declarations: [ManageHolidayCalendarComponent, MasterAgendaComponent, ManageActionComponent, ActionReceiverComponent],
  providers: [DatePipe, HolidayCalendarResolver, ManageActionResolver]
})
export class MfeAgendaConfigPagesModule {
  constructor(private configService: ConfigContextService){
    this.loadStyles();
  }

  private loadStyles() {
      const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'agenda');
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
