// advice and fees
import {
  AddressType2,
  AdviceGiven,
  BuilderGuaranteeSchemeType,
  ConstructionType,
  EmploymentContractType,
  EmploymentStatus,
  HeritageStatusType,
  Months,
  PermissionType,
  PropertyStyle,
  PropertyType,
  RealEstateScenario,
  RoofType,
  TemporaryContractType,
  TenureType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const AdviceGivenOptions = [
  { value: AdviceGiven.ADVISED, label: 'Advised' },
  { value: AdviceGiven.EXECUTION, label: 'Execution only' },
];

export const WhenPayableOptions = [
  { value: 'onCompletion', label: 'On completion' },
  { value: 'onApplication', label: 'On application' },
];

// current income
export const BasicSalaryFrequencyOptions = [
  { label: 'Annual', value: 'annual' },
  { label: 'Monthly', value: 'monthly' },
];

export const FrequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Fortnightly', value: 'fortnightly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Semi-annually', value: 'semiAnnually' },
  { label: 'Annual', value: 'annual' },
];

export const IncomeDescriptionOptions = [
  { label: 'Salary', value: 'salary' },
  { label: 'Daily rate', value: 'dailyRate' },
];

export const MonthsOption = [
  { label: 'Jan', value: Months.JANUARY },
  { label: 'Feb', value: Months.FEBRUARY },
  { label: 'Mar', value: Months.MARCH },
  { label: 'Apr', value: Months.APRIL },
  { label: 'May', value: Months.MAY },
  { label: 'Jun', value: Months.JUNE },
  { label: 'Jul', value: Months.JULY },
  { label: 'Aug', value: Months.AUGUST },
  { label: 'Sep', value: Months.SEPTEMBER },
  { label: 'Oct', value: Months.OCTOBER },
  { label: 'Nov', value: Months.NOVEMBER },
  { label: 'Dec', value: Months.DECEMBER },
];

export const ContractTypeOptions = [{ label: 'Temporary', value: EmploymentContractType.TEMPORARY }];

export const EmploymentStatusOptions = [
  { label: 'Employed', value: EmploymentStatus.Employed },
  { label: 'Self Employed - Partnership', value: EmploymentStatus.SelfEmployedPartnership },
  { label: 'Self Employed - Sole trader', value: EmploymentStatus.SelfEmployed },
  { label: 'Director >= 25% or with dividends', value: EmploymentStatus.Director25Plus },
  { label: 'Director < 25% with no dividends', value: EmploymentStatus.DirectorLess25 },
  { label: 'Home maker', value: EmploymentStatus.HomeMaker },
  { label: 'Student', value: EmploymentStatus.Student },
  { label: 'Not employed', value: EmploymentStatus.NotEmployed },
  { label: 'Retired', value: EmploymentStatus.Retired },
];

export const IncomeTypeOptions = [
  { label: 'Employment', value: 'employment' },
  { label: 'Other income', value: 'otherIncome' },
];

export const IncomeSourceOptions = [
  { label: 'Investment income', value: 'investmentIncome' },
  { label: 'Maintenance income (mandatory)', value: 'maintenanceIncome' },
  { label: 'Rental income', value: 'rentalIncome' },
  { label: 'Personal Independence Payment (PIP)', value: 'personalIndependencePayment' },
  { label: 'Child Benefit', value: 'childBenefit' },
  { label: 'Universal Credit/Tax Credits', value: 'universalCredit' },
  { label: 'Dividend income', value: 'dividendIncome' },
  { label: 'Annuity income', value: 'annuityIncome' },
  { label: 'Nursing bank', value: 'nursingBank' },
  { label: 'Attendance allowance', value: 'attendanceAllowance' },
  { label: 'Child tax credit', value: 'childTaxCredit' },
  { label: 'Foster care allowance', value: 'fosterCareAllowance' },
  { label: 'Disability benefit', value: 'disabilityBenefit' },
  { label: 'Carers allowance', value: 'carersAllowance' },
  { label: 'Bursary', value: 'bursary' },
  { label: 'Other', value: 'other' },
];

export const TemporaryContractTypeOptions = [
  { label: 'Open ended', value: TemporaryContractType.OPEN_ENDED },
  { label: 'Fixed term', value: TemporaryContractType.FIXED_TERM },
];

export const AddressTypeOptions = [
  { label: 'UK', value: 'UK' },
  { label: 'BFPO', value: 'BFPO' },
  { label: 'Overseas', value: 'Overseas' },
];

export const CompanyTypeOptions = [
  { label: 'LTD', value: 'ltd' },
  { label: 'LLP', value: 'llp' },
];

// product selection
export const RepaymentTypeOptions = [
  { label: 'Repayment', value: 'Annuity' },
  { label: 'Interest only', value: 'RedemptionFree' },
];

export const LoanPartTypeOptions = [
  { label: 'Purchase', value: 'Purchase' },
  { label: 'Remortgage', value: 'Remortgage' },
];

// security property
export const PropertyStyleOptions = [
  { label: 'Semi-detached', value: PropertyStyle.SEMI_DETACHED },
  { label: 'Detached', value: PropertyStyle.DETACHED },
  { label: 'End terrace', value: PropertyStyle.END_TERRACE },
  { label: 'Mid terrace', value: PropertyStyle.MID_TERRACE },
  { label: 'Purpose built', value: PropertyStyle.PURPOSE_BUILT_APARTMENT },
  { label: 'Converted', value: PropertyStyle.CONVERTED_APARTMENT },
  { label: 'Other', value: PropertyStyle.OTHER },
];

export const RoofTypeOptions = [
  { label: 'Tile/slate', value: RoofType.TILE_SLATE },
  { label: 'Thatched', value: RoofType.THATCHED },
  { label: 'Flat', value: RoofType.FLAT },
  { label: 'Other', value: PropertyType.OTHER },
];

export const PropertyTypeOptions = [
  { label: 'House', value: PropertyType.SINGLE_FAMILY_HOME },
  { label: 'Bungalow', value: PropertyType.BUNGALOW },
  { label: 'Flat/maisonette', value: PropertyType.FLAT_APARTMENT },
  { label: 'Other', value: PropertyType.OTHER },
];

export const HeritageStatusOptions = [
  { label: 'No', value: HeritageStatusType.NO },
  { label: 'Grade I', value: HeritageStatusType.GRADE_I },
  { label: 'Grade II*', value: HeritageStatusType.GRADE_II_S },
  { label: 'Grade II', value: HeritageStatusType.GRADE_II },
];

export const RealEstateScenarioOptions = [
  { label: 'Existing building', value: RealEstateScenario.EXISTING_BUILDING },
  { label: 'New build', value: RealEstateScenario.NEW_CONSTRUCTION },
  { label: 'Extensive recent renovation/conversion', value: RealEstateScenario.RENEWAL },
];

export const StandardConstructionOptions = [
  { label: 'Brick/Stone', value: ConstructionType.BRICK_STONE },
  { label: 'Concrete', value: ConstructionType.CONCRETE },
  { label: 'Steel framed', value: ConstructionType.STEEL_FRAMED },
  { label: 'Modern timber framed', value: ConstructionType.MODERN_TIMBER_FRAMED },
  {
    label: 'Modern method of construction (MMC/system built)',
    value: ConstructionType.MODERN_METHOD_OF_CONSTRUCTION_MMC_SYSTEM_BUILT,
  },
  { label: 'Large panel system', value: ConstructionType.LARGE_PANEL_SYSTEM },
  { label: 'Other', value: ConstructionType.OTHER },
];

export const TenureOptions = [
  { label: 'Leasehold', value: TenureType.LEASEHOLD },
  { label: 'Freehold', value: TenureType.FREEHOLD },
  { label: 'Commonhold', value: TenureType.COMMONHOLD },
];

export const PropertyGuaranteeSchemeOptions = [
  { label: 'NHBC', value: BuilderGuaranteeSchemeType.NHBC },
  { label: 'Premier Guarantee', value: BuilderGuaranteeSchemeType.PREMIER_GUARANTEE },
  { label: 'Build-Zone', value: BuilderGuaranteeSchemeType.BUILD_ZONE },
  { label: 'LABC Hall Mark', value: BuilderGuaranteeSchemeType.LABC_HALL_MARK },
  { label: 'Other', value: BuilderGuaranteeSchemeType.OTHER },
];

//Property and loan
export const locations = [
  { label: 'England', value: 'england' },
  { label: 'Wales', value: 'wales' },
];

//address history and contact detail
export const addressType = [
  { label: 'UK', value: AddressType2.Uk },
  { label: 'BFPO', value: AddressType2.Bfpo },
  { label: 'Overseas', value: AddressType2.Overseas },
];

export const permissionType = [
  { label: 'View', value: PermissionType.View },
  { label: 'Create illustration', value: PermissionType.Illustration },
  { label: 'Decision in principle', value: PermissionType.DecisionInPrinciple },
  { label: 'Full Mortgage application', value: PermissionType.FullMortgageApplication },
];
