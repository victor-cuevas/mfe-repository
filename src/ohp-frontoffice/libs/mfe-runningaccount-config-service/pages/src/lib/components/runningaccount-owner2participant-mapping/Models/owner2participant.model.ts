import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { creditProvider } from "./creditProvider.model";

export class owner2Participant extends baseModel {
  ownerReference!: number;
  participantReferenceFrom!: number;
  participantReferenceTo!: number;
  bookingOwnerReference!: number;
  isEntered!: boolean;
  ownerReferenceType!: creditProvider;
  participantReferenceFromType!: creditProvider;
  participantReferenceToType!: creditProvider;
  bookingOwnerReferenceType!: creditProvider;
}
