import { CreditProviderRef } from './creditprovider-ref.model';
import { Dtostate } from './dtobase.model';
import { ProductFamily } from './product-family.model';
import { ProductTypeDto } from './producttype.model';

export class SearchProductCodeTables{
    state!: Dtostate
    creditProviderRefList!: CreditProviderRef[]
    productTypeList !: ProductTypeDto[]
    ProductFamilyList!: ProductFamily[]
}