export const EmailPattern = /^([\da-zA-Z]([-.+\w]*[\da-z-A-Z])*@([\da-zA-Z][-\w]*[\da-zA-Z]\.)+[a-zA-Z]{2,9})$/;
export const EmailPatternUM = /^([\da-zA-Z]([-.+!#$%&?\w]*[\da-z-A-Z])*@([\da-zA-Z][-\w]*[\da-zA-Z]\.)+[a-zA-Z]{2,9})$/;
export const PhoneNumberPattern = /((^\+\d{8,14}$)|(^[0]\d{9}$))/;
export const MobilePattern = /^((\+[1-9]\d{7,13})|([0]\d{9}))$/;
export const MobilePhonePattern = /^[0-9]{9,10}$/;
export const PasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const KvKNumberPattern = /^\d{8}$/;
export const PostalCodePattern = /^([0-9]){1,4}$/;
export const CountryCodePattern = /^([A-Za-z]){1,4}$/;
export const HasUppercase = /(?=.*[A-Z])/;
export const Haslowercase = /(?=.*[a-z])/;
export const HasNumber = /(?=.*\d)/;
export const HasSpecialCharacter = /(?=.*[@$!%*?&])/;
export const AlphabetPattern = /^[a-zA-Z]+$/;
export const InvalidPostalCode = 'invalidPostalCode';
export const InvalidPhoneNumber = 'wrongNumber';
export const MaximumFileSize = 30000000;
export const DoughnutChart = 'doughnut';
export const HorizontalBarChart = 'horizontalBar';


