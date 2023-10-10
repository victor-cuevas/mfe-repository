import {
  PaymentTermResponse,
  ProductSelectionResponse,
  SubmissionRoute,
  SubmissionRouteAssociationModelEx,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

interface CreateProductSelectionOptions {
  ltv: number;
  network: string | null;
  mortgageClub: string | null;
  useMortgageClub: boolean | null;
}

const defaultOptions: CreateProductSelectionOptions = {
  ltv: 70,
  mortgageClub: '0ea55e1f',
  network: '123456',
  useMortgageClub: true,
};

export const psProductSelection: ProductSelectionResponse = {
  loanParts: [
    {
      loanPartAmount: 80000.0,
      loanPartId: 1,
      mortgageTerm: 180,
      product: {
        baseInterestRate: 4.1,
        code: 'FIXED75LTV12YEARS',
        durationInMonths: null,
        interestRate: 4.1,
        name: 'April Mortgages Standard',
        productFee: 1190.0,
        providerCode: null,
        variabilityType: 'FIXED',
      },
      productFees: [
        { feeAmount: 195.0, feeType: 'APPLICATION_FEE' },
        { feeAmount: 995.0, feeType: 'PRODUCT_FEE' },
      ],
      repaymentType: 'ANNUITY',
    },
  ],
  purchaseAmount: 100000.0,
  loanAmount: 80000,
  totalLoanAmount: 80000,
  useMortgageClub: false,
  valuationType: 'Undefined',
  loanId: 1,
  versionNumber: 0,
};

export const firmAssociations: SubmissionRouteAssociationModelEx = {
  firmType: 'DirectlyAuthorized',
  firmName: 'Mock Firm',
  fcaReference: 12345,
  firmId: 'MockFirm',
  networks: [
    {
      id: '1',
      reference: '123456',
      submissionRouteType: 'Network',
      firmName: 'General Bank',
      firmFcaReference: 892210,
      fcaStatus: 'Wrong firm FCA reference number',
      isActivated: true,
      isInReview: true,
      submissionRouteAddress: {
        numberOrBuilding: '7-9',
        postcode: 'W2 6LG',
        city: 'London',
        country: 'UK',
        lineOne: 'Bank Street',
        lineTwo: 'Bankley',
        lineThree: 'Banking Falls',
      },
      procurationFees: [
        {
          applicationType: 'NewLending',
          submissionRouteType: 'Network',
          completionFee: { value: 0.0, unit: 'BasisPoints', basis: 'LoanAmount' },
          trailFee: {
            value: 0.0,
            unit: 'BasisPoints',
            basis: 'LoanAmount',
            startingMonth: 60,
            periodInMonths: 12,
            endingType: 'Redemption',
          },
          isDefault: false,
        },
        {
          applicationType: 'Remortgage',
          submissionRouteType: 'Network',
          completionFee: { value: 700.0, unit: 'Currency' },
          trailFee: { value: 1000.0, unit: 'Currency', startingMonth: 1, periodInMonths: 24, endingType: 'Redemption' },
          isDefault: false,
        },
      ],
      bankDetails: { accountName: 'string', accountNumber: '88837491', sortCode: '08-90-12' },
    },
  ],
  clubs: [
    {
      id: '66f9a82d',
      reference: 'sss',
      submissionRouteType: 'MortgageClub',
      firmName: 'aaaaac',
      firmFcaReference: 236587,
      isActivated: true,
      isInReview: false,
      submissionRouteAddress: {
        numberOrBuilding: '12',
        postcode: 'W2 6LG',
        city: 'Derry',
        country: 'UK',
        lineOne: 'sdfsdf',
        lineTwo: '',
        lineThree: '',
        lineFour: 'sdf',
        lineFive: '',
      },
      procurationFees: [
        {
          applicationType: 'NewLending',
          submissionRouteType: 'MortgageClub',
          completionFee: { value: 100.0, unit: 'BasisPoints', basis: 'LoanAmount' },
          trailFee: {
            value: 120.0,
            unit: 'BasisPoints',
            basis: 'LoanAmount',
            startingMonth: 0,
            periodInMonths: 1,
            endingType: 'Redemption',
          },
          isDefault: false,
        },
        {
          applicationType: 'Remortgage',
          submissionRouteType: 'MortgageClub',
          completionFee: { value: 700.0, unit: 'Currency' },
          trailFee: { value: 1000.0, unit: 'Currency', startingMonth: 1, periodInMonths: 24, endingType: 'Redemption' },
          isDefault: false,
        },
      ],
      bankDetails: { accountName: 'adsasd', accountNumber: '23123434', sortCode: '10-23-12' },
    },
  ],
  directlyAuthorized: [],
};

const networkOption = {
  isInReview: true,
  submissionRouteAddress: {
    numberOrBuilding: '7-9',
    postcode: 'W2 6LG',
    city: 'London',
    country: 'UK',
    lineOne: 'Bank Street',
    lineTwo: 'Bankley',
    lineThree: 'Banking Falls',
  },
  procurationFees: [],
  bankDetails: { accountName: 'string', accountNumber: '88837491', sortCode: '08-90-12' },
};

const clubsOptions = {
  isInReview: false,
  submissionRouteAddress: {
    numberOrBuilding: '12',
    postcode: 'W2 6LG',
    city: 'Derry',
    country: 'UK',
    lineOne: 'sdfsdf',
    lineTwo: '',
    lineThree: '',
    lineFour: 'sdf',
    lineFive: '',
  },
  procurationFees: [],
  bankDetails: { accountName: 'adsasd', accountNumber: '23123434', sortCode: '10-23-12' },
};

const networkOptionActive1: SubmissionRoute = {
  ...networkOption,
  id: 'n1a',
  reference: 'n1a',
  submissionRouteType: 'Network',
  firmName: 'Firm N1',
  firmFcaReference: 111111,
  fcaStatus: 'Wrong firm FCA reference number',
  isActivated: true,
};

const networkOptionActive2: SubmissionRoute = {
  ...networkOption,
  id: 'n2a',
  reference: 'n2a',
  submissionRouteType: 'Network',
  firmName: 'Firm N2',
  firmFcaReference: 222222,
  fcaStatus: 'Wrong firm FCA reference number',
  isActivated: true,
};

const networkOptionInactive: SubmissionRoute = {
  ...networkOption,
  id: 'n3i',
  reference: 'n3i',
  submissionRouteType: 'Network',
  firmName: 'Firm 3',
  firmFcaReference: 333333,
  fcaStatus: 'Wrong firm FCA reference number',
  isActivated: false,
};

const clubsOptionsActive1: SubmissionRoute = {
  ...clubsOptions,
  id: 'c4a',
  reference: 'c4a',
  submissionRouteType: 'MortgageClub',
  firmName: 'Firm 4',
  firmFcaReference: 444444,
  isActivated: true,
};

const clubsOptionsActive2: SubmissionRoute = {
  ...clubsOptions,
  id: 'c5a',
  reference: 'c5a',
  submissionRouteType: 'MortgageClub',
  firmName: 'Firm 5',
  firmFcaReference: 555555,
  isActivated: true,
};

const clubsOptionsInactive1: SubmissionRoute = {
  ...clubsOptions,
  id: 'c6i',
  reference: 'c6i',
  submissionRouteType: 'MortgageClub',
  firmName: 'Firm 6',
  firmFcaReference: 666666,
  isActivated: false,
};

const clubsOptionsInactive2: SubmissionRoute = {
  ...clubsOptions,
  id: 'c7i',
  reference: 'c7i',
  submissionRouteType: 'MortgageClub',
  firmName: 'Firm 7',
  firmFcaReference: 777777,
  isActivated: false,
};

export const psNVal = { null: null, active1: 'n1a', active2: 'n2a', inactive: 'n3i' };
export const psMCVal = { null: null, active1: 'c4a', active2: 'c5a', inactive: 'c6i' };
export const psUMCVal = { true: true, false: false, null: null };

export const psNOpt = {
  active1: [networkOptionActive1],
  active2: [networkOptionActive2],
  inactive: [networkOptionInactive],
  empty: [],
};
export const psDAOpt = { empty: [] };

export const psMCOpt = {
  justActive1: [clubsOptionsActive1],
  justActive2: [clubsOptionsActive2],
  oneInactive: [clubsOptionsInactive1],
  oneActiveSomeInactive: [clubsOptionsActive1, clubsOptionsInactive1, clubsOptionsInactive2],
  someActive: [clubsOptionsActive1, clubsOptionsActive2],
  someInactive: [clubsOptionsInactive1, clubsOptionsInactive2],
  empty: [],
};

export const createProductSelectionResponse = (options?: Partial<CreateProductSelectionOptions>): ProductSelectionResponse => {
  const opts = Object.assign({}, defaultOptions, options);

  return {
    ...psProductSelection,
    network: opts.network,
    mortgageClub: opts.mortgageClub,
    useMortgageClub: opts.useMortgageClub,
    ltv: opts.ltv,
  };
};

export const createFirmAssociationsResponse: (
  networks: Array<SubmissionRoute>,
  clubs: Array<SubmissionRoute>,
  directlyAuthorized: Array<SubmissionRoute>,
) => SubmissionRouteAssociationModelEx = (networks = [], clubs = [], directlyAuthorized = []) => ({
  ...firmAssociations,
  networks,
  clubs,
  directlyAuthorized,
});

export const calculationPaymentTerms: PaymentTermResponse = {
  monthlyPayment: 524.3,
  monthlyPaymentFeesIncluded: 532.1,
  totalAmountPayable: 113249.09,
  totalAmountPayableFeesIncluded: 114933.51,
};
