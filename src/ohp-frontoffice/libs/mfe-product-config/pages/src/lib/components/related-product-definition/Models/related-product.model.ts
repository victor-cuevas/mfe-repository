import { DtoBase } from '../../search-product/Models/dtobase.model'
import { CodeTable } from './code-table.model'

export class RelatedProductTypeDef extends DtoBase {
    relatedProductType !: CodeTable       
    defaultPolicyPercentage !: number | null
    relatedProductTypeList !: CodeTable[]
    isReadOnly !: boolean;
    randomnumber!: number
    selectedRow!: boolean;
    disabledropdown !: boolean;
    disabletextbox!: boolean
}