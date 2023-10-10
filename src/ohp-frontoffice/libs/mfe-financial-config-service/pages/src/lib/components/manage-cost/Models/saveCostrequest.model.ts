
import { reminderCost } from "./remainderCost.model";
import { postageCost } from "./postageCost.model";
import { mutationCost } from "./mutationCost.model";

export class saveCostRequest {
  reminderCostList: reminderCost[]=[];
  postageCostList: postageCost[]=[];
  mutationCostList: mutationCost[]=[];
}
