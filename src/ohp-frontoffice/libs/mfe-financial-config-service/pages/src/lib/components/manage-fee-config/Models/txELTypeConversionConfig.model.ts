import { baseModel } from "./baseModel.model";
import { txElType } from "./txElType.model";


export class txElTypeConversionConfig extends baseModel {
  accountingWriteOffOn!: txElType;
  allocationTo!: txElType;
  bonusAllocationTo!: txElType;
  chargingOf!: txElType;
  collectionsBookingOfDue!: txElType;
  decreaseOf!: txElType;
  increaseOf!: txElType;
  initialBooking!: txElType;
  lossOn!: txElType;
  remissionOfNonPaid!: txElType;
  reversedAccountingWriteOffOn!: txElType;
  reversedAllocationTo!: txElType;
  reversedBonusAllocationTo!: txElType;
  reversedChargingOf!: txElType;
  reversedCollectionsDue!: txElType;
  reversedLossOn!: txElType;
  transferInOn!: txElType;
  reversedRemissionOfNonPaid!: txElType;
  constructionDepotAllocationTo!: txElType;
  dueDateDepotAllocationTo!: txElType;
  reversedConstructionDepotAllocationTo!: txElType;
  reversedDueDateDepotAllocationTo!: txElType;
  closeDue!: txElType;
  openDue!: txElType;

}
