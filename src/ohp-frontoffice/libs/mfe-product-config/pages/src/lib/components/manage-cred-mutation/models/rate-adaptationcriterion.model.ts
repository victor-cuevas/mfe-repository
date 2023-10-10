import { CodeTableDto } from './code-table.modle';
import { DtoBase } from './dto-base.model';

export class RateAdaptationCriterionDto extends DtoBase{
    rateAdaptationCriterionName !: CodeTableDto
    isSelected !: boolean
}