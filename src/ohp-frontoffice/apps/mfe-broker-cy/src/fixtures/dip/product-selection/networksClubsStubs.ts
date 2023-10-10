import { SubmissionRoute } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { portalTranslations } from '@close-front-office/mfe-broker/shared-assets';

import {
  case1,
  loan1,
  createGetCaseByIdResponse,
  createDipSummary,
  markDipProgressSteps,
  createProductsAvailabilityResponse,
  createProductSelectionResponse,
  createFirmAssociationsResponse,
  palPropertyAndLoanDetails,
  palPersonalDetails,
  palCurrentIncome,
  palExistingMortgage,
  psNVal,
  psMCVal,
  psUMCVal,
  psNOpt,
  psMCOpt,
  psDAOpt,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

type Combinations = [
  error: string,
  id: string,
  psNetwork: string | null,
  psMortgageClub: string | null,
  psUseMortgageClub: boolean | null,
  psNetworkOptions: SubmissionRoute[],
  psClubsOptions: SubmissionRoute[],
  psDirectlyAuthorizedOptions: SubmissionRoute[],
][];

export const getProductSelectionStubs: (
  network: string | null,
  mortgageClub: string | null,
  useMortgageClub: boolean | null,
  networkOptions: Array<SubmissionRoute>,
  clubsOptions: Array<SubmissionRoute>,
  directlyAuthorizedOptions: Array<SubmissionRoute>,
) => IStub[] = (network, mortgageClub, useMortgageClub, networkOptions, clubsOptions, directlyAuthorizedOptions) => [
  { method: 'GET', endpoint: `/cases/${case1.id}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('DIP') },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummary() },
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: palPropertyAndLoanDetails,
  },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: palPersonalDetails },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: palCurrentIncome },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage', stub: palExistingMortgage },
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: createProductSelectionResponse({ network, mortgageClub, useMortgageClub }),
  },
  {
    method: 'GET',
    endpoint: `/associations$`,
    alias: 'getFirmAssociations',
    stub: createFirmAssociationsResponse(networkOptions, clubsOptions, directlyAuthorizedOptions),
  },
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailabiliy',
    stub: createProductsAvailabilityResponse('success', { ltvValue: 74.9 }),
  },
  {
    method: 'GET',
    endpoint: '/progress$',
    alias: 'getProgress',
    stub: markDipProgressSteps(['propertyAndLoan', 'depositDetails', 'productSelection']),
  },
];

const error1 = portalTranslations.createIllustration.labels.noSubmissionRoutesOrClubs;
const error2 = portalTranslations.createIllustration.labels.invalidMortgageClubNoOthers;
const error3 = portalTranslations.createIllustration.labels.noSubmissionRoutes;
const error4 = portalTranslations.createIllustration.labels.invalidMortgageClub;

export const errorCombinations: Combinations = [
  // There is no available submission routes. Please contact your firm supervisor.
  [error1, 'e110', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e102', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e103', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.empty, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e104', psNVal.inactive, psMCVal.inactive, psUMCVal.false, psNOpt.empty, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e109', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e110', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e111', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e112', psNVal.inactive, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e116', psNVal.inactive, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e117', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e118', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e119', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.empty, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e123', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.empty, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e125', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e126', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e127', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e128', psNVal.inactive, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e131', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e132', psNVal.inactive, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.oneInactive, psDAOpt.empty],
  [error1, 'e133', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e135', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.empty, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e139', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.empty, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e141', psNVal.null, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e142', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e143', psNVal.null, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e144', psNVal.inactive, psMCVal.inactive, psUMCVal.false, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e147', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e148', psNVal.inactive, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.someInactive, psDAOpt.empty],
  [error1, 'e149', psNVal.active1, psMCVal.active1, psUMCVal.true, psNOpt.empty, psMCOpt.empty, psDAOpt.empty],
  [error1, 'e150', psNVal.active1, psMCVal.inactive, psUMCVal.true, psNOpt.empty, psMCOpt.oneInactive, psDAOpt.empty],

  // Selected Mortgage club is no longer available. Please use default submission route.
  [error2, 'e201', psNVal.null, psMCVal.active1, psUMCVal.true, psNOpt.active1, psMCOpt.empty, psDAOpt.empty],
  [error2, 'e202', psNVal.active1, psMCVal.active1, psUMCVal.true, psNOpt.active1, psMCOpt.empty, psDAOpt.empty],
  [error2, 'e203', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.active1, psMCOpt.oneInactive, psDAOpt.empty],
  [error2, 'e204', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.active1, psMCOpt.someInactive, psDAOpt.empty],
  [error2, 'e205', psNVal.active1, psMCVal.inactive, psUMCVal.true, psNOpt.active1, psMCOpt.oneInactive, psDAOpt.empty],
  [error2, 'e206', psNVal.active1, psMCVal.inactive, psUMCVal.true, psNOpt.active1, psMCOpt.someInactive, psDAOpt.empty],

  // Selected submission route is no longer available. Please choose a mortgage club or contact your firm supervisor.
  [error3, 'e301', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.justActive1, psDAOpt.empty],
  [error3, 'e302', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error3, 'e303', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.someActive, psDAOpt.empty],
  [error3, 'e304', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.justActive1, psDAOpt.empty],
  [error3, 'e305', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error3, 'e306', psNVal.active1, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.someActive, psDAOpt.empty],
  [error3, 'e307', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.justActive1, psDAOpt.empty],
  [error3, 'e308', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error3, 'e309', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.empty, psMCOpt.someActive, psDAOpt.empty],
  [error3, 'e300', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.justActive1, psDAOpt.empty],
  [error3, 'e311', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error3, 'e312', psNVal.inactive, psMCVal.null, psUMCVal.false, psNOpt.inactive, psMCOpt.someActive, psDAOpt.empty],

  // Selected Mortgage club is no longer available. Please select another one.
  [error4, 'e401', psNVal.null, psMCVal.active1, psUMCVal.true, psNOpt.empty, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e402', psNVal.active1, psMCVal.active1, psUMCVal.true, psNOpt.empty, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e403', psNVal.inactive, psMCVal.active1, psUMCVal.true, psNOpt.inactive, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e404', psNVal.null, psMCVal.inactive, psUMCVal.true, psNOpt.empty, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e405', psNVal.active1, psMCVal.inactive, psUMCVal.true, psNOpt.empty, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e406', psNVal.inactive, psMCVal.inactive, psUMCVal.true, psNOpt.inactive, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e407', psNVal.null, psMCVal.active2, psUMCVal.true, psNOpt.empty, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error4, 'e408', psNVal.active1, psMCVal.active2, psUMCVal.true, psNOpt.empty, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error4, 'e409', psNVal.inactive, psMCVal.active2, psUMCVal.true, psNOpt.inactive, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
  [error4, 'e410', psNVal.active1, psMCVal.active1, psUMCVal.true, psNOpt.active1, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e411', psNVal.active1, psMCVal.inactive, psUMCVal.true, psNOpt.active1, psMCOpt.justActive2, psDAOpt.empty],
  [error4, 'e412', psNVal.active1, psMCVal.active2, psUMCVal.true, psNOpt.active1, psMCOpt.oneActiveSomeInactive, psDAOpt.empty],
];
