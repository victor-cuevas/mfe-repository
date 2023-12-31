import { BrokerCodeTableOption } from '../index';

const tuple = <T extends string[]>(...args: T) => args;

export const PortalCodeTables = tuple(
  'cdtb-additionalborrowingreason',
  'cdtb-ads-civilstate',
  'cdtb-ads-employmentstatus',
  'cdtb-ads-ownedcompanytype',
  'cdtb-ads-partnershiptype',
  'cdtb-ads-realestateagreementtype',
  'cdtb-ads-retirementincomesource',
  'cdtb-ads-valuationtype',
  'cdtb-amortizationmethod',
  'cdtb-broker-addresstype',
  'cdtb-broker-advicegiven',
  'cdtb-broker-applicanttypes',
  'cdtb-broker-applicationtypes',
  'cdtb-broker-contactmethods',
  'cdtb-broker-financialcommitments',
  'cdtb-broker-incomedescription',
  'cdtb-broker-incomesource',
  'cdtb-broker-incometype',
  'cdtb-broker-lenderfeetype',
  'cdtb-broker-loanparttype',
  'cdtb-broker-months',
  'cdtb-broker-propertypurpose',
  'cdtb-broker-propertystyle',
  'cdtb-broker-temporarycontracttype',
  'cdtb-broker-timescale',
  'cdtb-broker-whenpayable',
  'cdtb-builderguaranteeschemetype',
  'cdtb-buildingtype',
  'cdtb-constructiontype',
  'cdtb-costpaymentmethod',
  'cdtb-countrycode',
  'cdtb-deposittype',
  'cdtb-employmentcontracttype',
  'cdtb-existinglender',
  'cdtb-expensetype',
  'cdtb-futurefinancialchangecategory',
  'cdtb-futurefinancialchangereason',
  'cdtb-heritagestatustype',
  'cdtb-jurisdiction',
  'cdtb-parkingspacetype',
  'cdtb-partyfinancialamountsign',
  'cdtb-persontitle',
  'cdtb-preferredcontactmethod',
  'cdtb-preferredcontacttime',
  'cdtb-preferredprintformat',
  'cdtb-realestatescenario',
  'cdtb-residencesituationtype',
  'cdtb-rooftype',
  'cdtb-salaryfrequency',
  'cdtb-tenuretype',
  'cdtb-valuationcontact',
  'cdtb-vulnerabilitytype',
  'cdtb-withdrawmethod',
);

export type PortalCodeTables = typeof PortalCodeTables[number];
export type CodeTables = Record<PortalCodeTables, BrokerCodeTableOption[]>;
export const defaultCodeTables: CodeTables = PortalCodeTables.reduce((acc, codeTable) => ({ ...acc, [codeTable]: [] }), {} as CodeTables);
