import { mutationTypeConfig } from "./mutationTypeConfig.model"

export class mutationTypeList extends mutationTypeConfig{
  codeId?: number
  caption?: string
  extRefCode?: string
  seqNo?: number
  defaultCaption?: string
  enumCaption?: string
  isSelected?: boolean
}
