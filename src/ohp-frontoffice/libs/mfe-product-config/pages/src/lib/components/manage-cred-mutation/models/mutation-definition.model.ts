import { CodeTableDto } from './code-table.modle';
import { DtoBase } from './dto-base.model';
import { RateAdaptationCriterionDto } from './rate-adaptationcriterion.model';

export class MutationDefinitionDto extends DtoBase {
  mutationType!: CodeTableDto;
  mutationTypeList!: CodeTableDto[];
  rateSelectionDateType!: CodeTableDto;
  rateSelectionDateTypeList!: CodeTableDto[];
  rateAdaptationCriterionList!: RateAdaptationCriterionDto[];
  automaticRateReevaluationCheckNeeded!: boolean;
  SelectedRow!: boolean;
  isReadOnly!: boolean;
  randomNumber!: number
  disableMutation!: boolean
  showClearIcon!: boolean;
  disableCheckBox !: boolean;
}
