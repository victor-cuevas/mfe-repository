import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as AuthConfigUserActions from './authconfig-user.actions';

export const AUTHCONFIGUSER_FEATURE_KEY = 'authConfigUser';

export interface AuthConfigUserState extends EntityState<any> {
  entity?: any;
  loaded: boolean;
  error: string | null;
}

export const userRolesAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialState: AuthConfigUserState = userRolesAdapter.getInitialState({
  loaded: false,
  error: null
});

const authorisationUserReducer = createReducer(
  initialState,
  on(AuthConfigUserActions.init, state => ({ ...state, loaded: false, error: null })),
  on(AuthConfigUserActions.loadAuthConfigUserSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(AuthConfigUserActions.loadAuthConfigUserFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: AuthConfigUserState | undefined, action: Action) {
  return authorisationUserReducer(state, action);
}
