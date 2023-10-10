import { DtoBase } from './dtobase.model';
import { CodeTable } from './code-table.model';

export class DocumentTemplateDto extends DtoBase{
      adHoc !: boolean
      batch !: boolean
      documentTemplateType !: CodeTable
      docGenType!: CodeTable
      name !: string
}