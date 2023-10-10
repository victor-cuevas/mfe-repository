export const casesDipTitleOptions = [
  { label: 'Mr', value: 'mr' },
  { label: 'Mrs', value: 'mrs' },
  { label: 'Ms', value: 'ms' },
  { label: 'Mx', value: 'mx' },
  { label: 'Dr', value: 'dr' },
  { label: 'Professor', value: 'professor' },
];

export const casesDipMaritalStatusOption = [
  { label: 'Married', value: 'married' },
  { label: 'Single', value: 'single' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Civil partnership', value: 'civil-partnership' },
  { label: 'Separated', value: 'separated' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Living with partner', value: 'livingWithPartner' },
];

export const casesDipVulnerabilityOptions = [
  { label: 'Health - Physical disability', value: 'hPhysicalDisability' },
  { label: 'Health - Severe or long term illness', value: 'hSevereIllness' },
  { label: 'Health - Hearing or visual impairment', value: 'hHearingVisual' },
  { label: 'Health - Mental health condition or disability', value: 'hMentalHealth' },
  { label: 'Health - Addiction', value: 'hAddiction' },
  { label: 'Health - Low mental capacity or cognitive disability', value: 'hLowMentalCapacity' },
  { label: 'Life events - Retirement', value: 'lRetirement' },
  { label: 'Life events - Bereavement', value: 'lBereavement' },
  { label: 'Life events - Income shock', value: 'lIncomeShock' },
  { label: 'Life events - Relationship breakdown', value: 'lRelationshipBreakdown' },
  { label: 'Life events - Domestic abuse (including economic control)', value: 'lDomesticAbuse' },
  { label: 'Life events - Caring responsibilities', value: 'lCaringResponsibilities' },
  { label: 'Life events - Other circumstances affecting financial service experience', value: 'lOther' },
  { label: 'Resilience - Inadequate or erratic income', value: 'rInadequateIncome' },
  { label: 'Resilience - Over-indebtedness', value: 'rOverIndebtedness' },
  { label: 'Resilience - Low savings', value: 'rLowSavings' },
  { label: 'Resilience - Low emotional resistance', value: 'rLowEmotionalResistance' },
  { label: 'Capability - Low knowledge or confidence in managing finances', value: 'cLowKnowledge' },
  { label: 'Capability - Poor literacy or numeracy skills', value: 'cPoorLiteracy' },
  { label: 'Capability - Poor English language skills', value: 'cPoorEnglish' },
  { label: 'Capability - Poor or non -existent digital skills', value: 'cPooDigitalSkills' },
  { label: 'Capability - Learning difficulties', value: 'cLearningDifficulties' },
  { label: 'Capability - No or low access to help or support', value: 'cLowAccessHelp' },
  { label: 'Multiple vulnerabilities / other', value: 'MultipleVulnerabilities' },
];

export const existingLenderOptions = [
  { label: 'April Mortgages', value: 'aprilMortgages' },
  { label: 'Barclays', value: 'barclays' },
  { label: 'Clydesdale Bank', value: 'clydesdaleBank' },
  { label: 'Coventry', value: 'coventry' },
  { label: 'HSBC', value: 'HSBC' },
  { label: 'Nationwide', value: 'nationwide' },
  { label: 'NatWest', value: 'natWest' },
  { label: 'Royal Bank of Scotland', value: 'royalBankScotland' },
  { label: 'Santander', value: 'santander' },
  { label: 'Virgin Money', value: 'virginMoney' },
  { label: 'Leeds Building Society', value: 'leedsBuildingSociety' },
  { label: 'TSB Bank', value: 'TSB' },
  { label: 'Yorkshire Building Society', value: 'yorkshireBuildingSociety' },
  { label: 'Aldermore Bank', value: 'aldermoreBank' },
  { label: 'Bank of Ireland', value: 'bankIreland' },
  { label: 'HBoS', value: 'HBoS' },
  { label: 'Cumberland', value: 'cumberland' },
  { label: 'Darlington Building Society', value: 'darlingtonBuildingSociety' },
  { label: 'Kensington Mortgages', value: 'kensingtonMortgages' },
  { label: 'Lloyds Bank', value: 'lloydsBank' },
  { label: 'Metro Bank', value: 'metroBank' },
  { label: 'Pepper UK', value: 'pepperUK' },
  { label: 'Principality', value: 'principality' },
  { label: 'Skipton Building Society', value: 'skiptonBuildingSociety' },
  { label: 'The Co-operative Bank', value: 'coOperativeBank' },
  { label: 'Yorkshire Bank', value: 'yorkshireBank' },
  { label: 'West Bromwich Building Society', value: 'westBromwichBuildingSociety' },
  { label: 'Other', value: 'other' },
];

//additional borrowing
export const reasonOptions = [
  { label: 'Home improvements', value: 'homeImprovements' },
  { label: 'Structural home improvement', value: 'structuralHomeImprovement' },
  { label: 'Buy out non-borrower', value: 'buyOutNonBorrower' },
  { label: 'Buy additional share in a shared ownership', value: 'buyAdditionalShare' },
  { label: 'Buy final share in a shared ownership', value: 'buyFinalShare' },
  { label: 'Buy a share in freehold', value: 'buyShareFreehold' },
  { label: 'Buy freehold title or new extended lease', value: 'BuyFreeholdTitleLease' },
  { label: 'Buy land to extend security', value: 'buyLandToExtendSecurity' },
  { label: 'Business purposes', value: 'businessPurposes' },
  { label: 'Buy property for main residence & let current property', value: 'buyPropertyMainResidence' },
  { label: 'Buy land or property separate from the security', value: 'buyLendProperty' },
  { label: 'Pay off second charge', value: 'payOffSecondCharge' },
  { label: 'Legal fees', value: 'legalFees' },
  { label: 'Buy out joint borrower', value: 'buyOutJointBorrower' },
  { label: 'Investment Purposes', value: 'investmentPurposes' },
  { label: 'Deposit for property', value: 'depositProperty' },
  { label: 'Gift to relative', value: 'giftRelative' },
  { label: 'Essential repairs', value: 'essentialRepairs' },
  { label: 'Other', value: 'other' },
];

//future changes
export const typeOfChangeOptions = [
  { label: 'Income', value: 'income' },
  { label: 'Expenditure', value: 'expenditure' },
];

export const changeOptions = [
  { label: 'Increase', value: 'increase' },
  { label: 'Decrease', value: 'decrease' },
];
export const reasonOptionsFutureChanges = [
  { label: 'Maternity/Paternity', value: 'maternityPaternity' },
  { label: 'Sabbatical', value: 'sabbatical' },
  { label: 'Career break', value: 'careerBreak' },
  { label: 'Pay rise/Promotion', value: 'PayRise' },
  { label: 'Fund maturity', value: 'fundMaturity' },
  { label: 'Other', value: 'other' },
];

export const timeScaleOptions = [
  { label: 'Within 6 months', value: 'sixMonths' },
  { label: 'Within 1 year', value: 'oneYear' },
  { label: 'Within 2 year', value: 'twoYear' },
  { label: 'Within 3 year', value: 'threeYear' },
  { label: 'Within 5 year', value: 'fiveYear' },
];

//financial commitments
export const expenditureTypeOptions = [
  { label: 'Buy now pay later', value: 'buyNowPayLater' },
  { label: 'Charge Card', value: 'chargeCard' },
  { label: 'Credit Card / Store Card', value: 'creditCard' },
  { label: 'Hire purchase', value: 'hirePurchase' },
  { label: 'Interest free loan', value: 'interestFreeLoan' },
  { label: 'Mail order account', value: 'mailOrderAccount' },
  { label: 'Overdraft', value: 'overdraft' },
  { label: 'Personal loan', value: 'personalLoan' },
  { label: 'Secured loan (excluding BTL)', value: 'securedLoan' },
  { label: 'Student loan', value: 'studentLoan' },
  { label: 'Unsecured loan', value: 'unsecuredLoan' },
  { label: 'Other', value: 'other' },
];

//deposit details
export const sourceOfDepositOptions = [
  { label: 'Savings', value: 'saving' },
  { label: 'Equity', value: 'equity' },
  { label: 'Gift', value: 'gift' },
  { label: 'Forces Help To Buy', value: 'forces-help-to-buy' },
];

//address history
export const occupancyOptions = [
  { label: 'Owner occupier', value: 'owner-occupier' },
  { label: 'Tenant (private)', value: 'tenant-private' },
  { label: 'Tenant (council)', value: 'tenant-council' },
  { label: 'Housing association rental', value: 'housing-association-rental' },
  { label: 'Living with family or friends', value: 'living-family-friends' },
  { label: 'Employment housing', value: 'employment-housing' },
];
