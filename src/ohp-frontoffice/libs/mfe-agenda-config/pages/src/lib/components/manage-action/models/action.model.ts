import { ActionFunctionalityDto } from './action-functionality.model'
import { ActionReceiverTypeDto } from './action-reciverType.model'
import { ActionTypeDto } from './action-type.model'
import { Dtobase } from './dtobase.model'
import { PriorityDto } from './priority.model'



  export class ActionDto extends Dtobase{
   

      nameEN !: string
      nameFR!: string
      nameNL!: string
      actionReceiverTypeName !: ActionReceiverTypeDto | null
      actionMessage !: string
      actionType ?:ActionTypeDto | null
      defaultHandleMargin !:number
      descriptionEN !: string
      descriptionFR !: string
      descriptionNL !: string
      defaultHandleTimeDays !:number
      defaultHandleTimeHours !:number
      defaultHandleTimeMinutes !:number
      defaultName !: string
      defaultHandlePeriod !: string
      actionCode !: string
      priority !: PriorityDto | null
      name !: string
      calculatedDeadlineDate !:Date
      actionFunctionality !:ActionFunctionalityDto | null
      defaultHandleTime !: number
  }