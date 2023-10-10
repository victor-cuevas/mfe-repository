import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as PortalUserActions from './portal-user.actions';
import { AuthorizationContextModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const PORTALUSER_FEATURE_KEY = 'portalUser';

export interface PortalUserState extends EntityState<AuthorizationContextModel> {
  entity?: AuthorizationContextModel;
  loaded: boolean;
  error: string | null;
}

export const userRolesAdapter: EntityAdapter<AuthorizationContextModel> = createEntityAdapter<AuthorizationContextModel>();

export const initialState: PortalUserState = userRolesAdapter.getInitialState({
  loaded: false,
  error: null,
});

const portalUserReducer = createReducer(
  initialState,
  on(PortalUserActions.init, state => ({ ...state, loaded: false, error: null })),
  on(PortalUserActions.loadPortalUserSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(PortalUserActions.loadPortalUserFailure, (state, { error }) => ({ ...state, error })),
);

export function reducer(state: PortalUserState | undefined, action: Action) {
  return portalUserReducer(state, action);
}
