import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { PersonalDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

import * as PersonalDetailsActions from './personal-details.actions';

export const PERSONAL_DETAILS_FEATURE_KEY = 'personalDetails';

export interface PersonalDetailsState extends EntityState<PersonalDetailsResponse> {
  entity?: PersonalDetailsResponse;
  loaded: boolean;
  error: string | null;
}

export const personalDetailsAdapter: EntityAdapter<PersonalDetailsResponse> = createEntityAdapter<PersonalDetailsResponse>();

export const personalDetailsInitialState: PersonalDetailsState = personalDetailsAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  personalDetailsInitialState,
  on(PersonalDetailsActions.initPersonalDetails, state => ({ ...state, loaded: false, error: null })),
  on(PersonalDetailsActions.loadPersonalDetailsSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(PersonalDetailsActions.loadPersonalDetailsFailure, (state, { error }) => ({ ...state, error })),
);

export function personalDetailsReducer(state: PersonalDetailsState | undefined, action: Action) {
  return reducer(state, action);
}
