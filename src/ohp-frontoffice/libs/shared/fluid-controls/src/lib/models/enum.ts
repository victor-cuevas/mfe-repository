export enum FluidControlType {
  TEXT = 'text',
  ALPHABETPATTERN = 'textWithAlphabets',
  PASSWORD = 'password',
  PASSWORDPATTERN = 'passwordWithPattern',
  NUMBERS = 'numbers',
  NUMBERSMAXLENGTH = "numbersMaxLength",
  TELEPHONE = 'telephone',
  MOBILEPATTERN = 'mobilePattern',
  EMAIL = 'email',
  EMAILUM = 'emailUM',
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount',
  AMOUNTWITHLIMITVALIDATION = 'amountLimitValidation',
  DURATION = 'duration',
  DATE = "date",
  POSTCODE = "postCode",
  IBAN = "iban",
  MESSAGE = "message",
  MESSAGES = "messages",
  TOAST = "toast",
  NONDECIMALAMOUNT = "nonDecimalAmount",
  NUMBERSTYPE = "numbersType",
  ALPHABETPATTERNNITIALS = "textWithAlphabetsInitials",
  EMAILTEXTLOWERCASE = "EmailLowerCasetext"

}

export enum FluidMessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error'
}
