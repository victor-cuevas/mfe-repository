import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';
import { preComputedDetailDto } from './precomputedDetailDto.model';
import { revolvingDetailsWithoutRepayDto } from './revolvingDetailsWithoutRepayDto.model';
import { revolvingDetailsWithRepayDto } from './revolvingDetailsWithRepayDto.model';
import { thresholdForCreditBureauRegistrationListDto } from './threshold-CreditBureau-RegistrationListDto.model';


export class legislationDto extends DtoBase {
  country!: codeTable;
  endDate!: Date | null;
  startDate!: Date;
  precomputedDetails: preComputedDetailDto[]=[];
  revolvingDetailsWithRepay: revolvingDetailsWithRepayDto[]=[];
  revolvingDetailsWithoutRepay: revolvingDetailsWithoutRepayDto[]=[];
  thresholdForCreditBureauRegistrationList: thresholdForCreditBureauRegistrationListDto[]=[];
  randomNumber!:number;
  selectedRow!: boolean;
  modifiedStartDate!:string | null;
  modifiedEndDate!:string| null;

}
