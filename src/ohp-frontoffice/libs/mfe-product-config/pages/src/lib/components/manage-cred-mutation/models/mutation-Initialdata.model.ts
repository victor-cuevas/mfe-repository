import { CodeTableDto } from './code-table.modle'

export class MutationInitialDataDto{
    mutationReasonNameList !:CodeTableDto[]
    blockingTypeList !:CodeTableDto[]
    requiredActionList !:CodeTableDto[]
    missingDocNameList !:CodeTableDto[]
    mutationTypeList !:CodeTableDto[]
    rateAdaptationCriterionNameList !:CodeTableDto[]
    rateSelectionDateTypeList !:CodeTableDto[]
    
}