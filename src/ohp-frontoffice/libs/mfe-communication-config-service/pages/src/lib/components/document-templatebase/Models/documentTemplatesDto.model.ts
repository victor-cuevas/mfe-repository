import { DocGenTypeDto } from './docGenTypeDto.model';
import { DocumentTemplateTypeDto } from './documentTemplateTypeDto.model';
import { OutputFormatDto } from './outputFormatDto.model';
import { DocGenDtoNameDto } from './docGenDtoNameDto.model';
import { DocumentTemplateBaseDto } from './documentTemplateBaseDto.model';
export class DocumentTemplatesDto extends DocumentTemplateBaseDto {
  docGenType!: DocGenTypeDto | null;
  documentTemplateType!: DocumentTemplateTypeDto | null;
  adHoc!: boolean
  modifiedadHoc!: string
  validFrom!: Date;
  modifiedvalidFrom!: string | null;
  validUntil!: Date;
  modifiedvalidUntil!: string | null;
  outputFormat!: OutputFormatDto | null;
  docGenDtoName!: DocGenDtoNameDto | null;
  isLinkedwithCommunication!: boolean
  isEntered!: boolean;
}
