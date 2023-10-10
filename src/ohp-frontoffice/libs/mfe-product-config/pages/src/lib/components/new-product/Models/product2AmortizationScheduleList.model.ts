
import { amortizationSheduleList } from "./amortizationSheduleList.model"
import { baseModel } from "./baseModel.model"

export class product2AmortizationScheduleList extends baseModel {
  amortizationShedule!: amortizationSheduleList
  isSelected!: boolean
}
