import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PERSONAL_DETAILS_FEATURE_KEY, PersonalDetailsState } from './personal-details.reducer';

export const getPersonalDetailsState = createFeatureSelector<PersonalDetailsState>(PERSONAL_DETAILS_FEATURE_KEY);

export const getPersonalDetailsError = createSelector(getPersonalDetailsState, (state: PersonalDetailsState) => state.error);

export const getPersonalDetails = createSelector(getPersonalDetailsState, (state: PersonalDetailsState) => state.entity);
