import { MutationDefinitionDto } from './mutation-definition.model'
import { MutationReasonConfigDto } from './mutation-reason.model'


export class MutationDataDto{
    mutationDefinitionList:MutationDefinitionDto[]=[]
    mutationReasonList:MutationReasonConfigDto[]=[]
}