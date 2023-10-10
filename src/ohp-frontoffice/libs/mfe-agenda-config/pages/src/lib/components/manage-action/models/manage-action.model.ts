import { ActionFunctionalityDto } from './action-functionality.model'
import { ActionReceiverTypeDto } from './action-reciverType.model'
import { ActionTypeDto } from './action-type.model'
import { ActionDto } from './action.model'
import { Dtostate } from './dtobase.model'
import { PriorityDto } from './priority.model'

export class AllActionDto{
       state !:Dtostate
       actionsList !:ActionDto[]
       actionReceiverTypeList !:ActionReceiverTypeDto[]
       actionTypeNameList !:ActionTypeDto[]
       actionFunctionalityList !:ActionFunctionalityDto[]
       priorityList !: PriorityDto[]
}