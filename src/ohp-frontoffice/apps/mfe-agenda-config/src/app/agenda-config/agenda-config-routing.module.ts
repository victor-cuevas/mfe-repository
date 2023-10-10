import { Routes } from '@angular/router';
export const AGENDA_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-agenda-config/pages').then(m => m.MfeAgendaConfigPagesModule)
  }
];
