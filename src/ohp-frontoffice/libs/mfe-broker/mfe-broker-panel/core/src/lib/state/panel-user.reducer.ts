import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as PanelUserActions from './panel-user.actions';

export const PANELUSER_FEATURE_KEY = 'panelUser';

export interface PanelUserState extends EntityState<any> {
  entity?: any;
  loaded: boolean;
  error: string | null;
}

export const userRolesAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialState: PanelUserState = userRolesAdapter.getInitialState({
  loaded: false,
  error: null,
});

const panelUserReducer = createReducer(
  initialState,
  on(PanelUserActions.init, state => ({ ...state, loaded: false, error: null })),
  on(PanelUserActions.loadPanelUserSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(PanelUserActions.loadPanelUserFailure, (state, { error }) => ({ ...state, error })),
);

export function reducer(state: PanelUserState | undefined, action: Action) {
  return panelUserReducer(state, action);
}
