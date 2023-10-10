import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UserProfileActions from './profile.actions';
import { UserProfile } from '../models/profile';

export const USERPROFILE_FEATURE_KEY = 'userProfile';

export interface UserProfileState extends EntityState<UserProfile> {
  entity: UserProfile;
  loaded: boolean;
  error?: string | null;
}

export const userProfileAdapter: EntityAdapter<UserProfile> = createEntityAdapter<UserProfile>();

export const initialState: UserProfileState = userProfileAdapter.getInitialState({
  entity: {},
  loaded: false,
});

const userProfileReducer = createReducer(
  initialState,
  on(UserProfileActions.init, state => ({ ...state, loaded: false, error: null })),
  on(UserProfileActions.loadUserProfileSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(UserProfileActions.loadUserProfileFailure, (state, { error }) => ({ ...state, error })),
);

export function reducer(state: UserProfileState | undefined, action: Action) {
  return userProfileReducer(state, action);
}
