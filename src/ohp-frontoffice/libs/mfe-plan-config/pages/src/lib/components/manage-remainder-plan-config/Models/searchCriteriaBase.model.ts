import { stateModel } from "./state.model";

export class searchCriteriaBase {
  halfPageSize!: number;
  defaultPageSize!: number;
  pageIndex!: number;
  pageSize!: number;
  sortMode!: string;
  sortColumn!: string;
  canValidate!: boolean;
  enableSearch!: boolean;
  state!: stateModel;
}
