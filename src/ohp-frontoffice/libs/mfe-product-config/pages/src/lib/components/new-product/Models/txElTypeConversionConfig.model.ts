import { accountingWriteOffOn } from "./accountingWriteOffOn.model"
import { allocationTo } from "./allocationTo.model"
import { bonusAllocationTo } from "./bonusAllocationTo.model"
import { chargingOf } from "./chargingOf.model"
import { closeDue } from "./closeDue.model"
import { collectionsBookingOfDue } from "./collectionsBookingOfDue.model"
import { constructionDepotAllocationTo } from "./constructionDepotAllocationTo.model"
import { decreaseOf } from "./decreaseOf.model"
import { dueDateDepotAllocationTo } from "./dueDateDepotAllocationTo.model"
import { increaseOf } from "./increaseOf.model"
import { initialBooking } from "./initialBooking.model"
import { lossOn } from "./lossOn.model"
import { openDue } from "./openDue.model"
import { remissionOfNonPaid } from "./remissionOfNonPaid.model"
import { reversedAccountingWriteOffOn } from "./reversedAccountingWriteOffOn.model"
import { reversedAllocationTo } from "./reversedAllocationTo.model"
import { reversedBonusAllocationTo } from "./reversedBonusAllocationTo.model"
import { reversedChargingOf } from "./reversedChargingOf.model"
import { reversedCollectionsDue } from "./reversedCollectionsDue.model"
import { reversedConstructionDepotAllocationTo } from "./reversedConstructionDepotAllocationTo.model"
import { reversedDueDateDepotAllocationTo } from "./reversedDueDateDepotAllocationTo.model"
import { reversedLossOn } from "./reversedLossOn.model"
import { reversedRemissionOfNonPaid } from "./reversedRemissionOfNonPaid.model"
import { transferInOn } from "./transferInOn.model"

export class txElTypeConversionConfig {
  accountingWriteOffOn!: accountingWriteOffOn
  allocationTo!: allocationTo
  bonusAllocationTo!: bonusAllocationTo
  chargingOf!: chargingOf
  collectionsBookingOfDue!: collectionsBookingOfDue
  decreaseOf!: decreaseOf
  increaseOf!: increaseOf
  initialBooking!: initialBooking
  lossOn!: lossOn
  remissionOfNonPaid!: remissionOfNonPaid
  reversedAccountingWriteOffOn!: reversedAccountingWriteOffOn
  reversedAllocationTo!: reversedAllocationTo
  reversedBonusAllocationTo!: reversedBonusAllocationTo
  reversedChargingOf!: reversedChargingOf
  reversedCollectionsDue!: reversedCollectionsDue
  reversedLossOn!: reversedLossOn
  transferInOn!: transferInOn
  reversedRemissionOfNonPaid!: reversedRemissionOfNonPaid
  constructionDepotAllocationTo!: constructionDepotAllocationTo
  dueDateDepotAllocationTo!: dueDateDepotAllocationTo
  reversedConstructionDepotAllocationTo!: reversedConstructionDepotAllocationTo
  reversedDueDateDepotAllocationTo!: reversedDueDateDepotAllocationTo
  closeDue!: closeDue
  openDue!: openDue
}
